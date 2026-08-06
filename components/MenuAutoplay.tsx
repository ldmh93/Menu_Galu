"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { site } from "@/config/site";
import type { MenuScreen as MenuScreenData } from "@/data/types";
import { cambioDePantalla } from "@/lib/motion";
import { MenuScreen } from "./MenuScreen";

interface MenuAutoplayProps {
  /** Pantallas en secuencia. Un menu puede aportar varias. */
  menus: MenuScreenData[];
  /**
   * Etiqueta del menu de cada pantalla, para agrupar el indicador de progreso.
   * Si se omite se usa el titulo de cada pantalla.
   */
  labels?: string[];
  /** Segundos por pantalla. Por defecto, config/site.ts. */
  seconds?: number;
}

/**
 * Reproductor del menu digital.
 *
 * Cambia de pantalla cada N segundos con un fundido cruzado. No navega entre
 * rutas a proposito: mantener todo en memoria elimina parpadeos y recargas, que
 * es justo lo que se nota en una pantalla encendida todo el dia.
 *
 * Controles para la instalacion y las pruebas:
 *   ?autoplay=off   arranca en pausa
 *   ← / →           pantalla anterior / siguiente
 *   barra espaciadora  pausa y reanuda
 */
export function MenuAutoplay({ menus, labels, seconds }: MenuAutoplayProps) {
  const duracion = seconds ?? site.autoplaySeconds;
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);

  const etiquetas = useMemo(
    () => labels ?? menus.map((menu) => menu.title),
    [labels, menus],
  );

  const avanzar = useCallback(
    (paso: number) => {
      setIndice((actual) => (actual + paso + menus.length) % menus.length);
    },
    [menus.length],
  );

  // ?autoplay=off para dejar la pantalla fija durante la instalacion.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const valor = params.get("autoplay");
    if (valor === "off" || valor === "false" || valor === "0") {
      setPausado(true);
    }
  }, []);

  // Temporizador principal.
  useEffect(() => {
    if (pausado || menus.length < 2) return;

    const temporizador = setTimeout(() => avanzar(1), duracion * 1000);
    return () => clearTimeout(temporizador);
  }, [indice, pausado, duracion, menus.length, avanzar]);

  // Pausa mientras la pestana no esta visible: ahorra CPU en el reproductor.
  useEffect(() => {
    const alCambiarVisibilidad = () => {
      if (document.hidden) return;
      setIndice((actual) => actual); // reinicia el temporizador al volver
    };

    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    return () =>
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
  }, []);

  // Controles de teclado.
  useEffect(() => {
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === "ArrowRight") {
        evento.preventDefault();
        avanzar(1);
      } else if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        avanzar(-1);
      } else if (evento.code === "Space") {
        evento.preventDefault();
        setPausado((valor) => !valor);
      }
    };

    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [avanzar]);

  const menuActivo = menus[indice];

  return (
    <div className="relative h-full w-full">
      <AnimatePresence initial={false}>
        <motion.div
          key={menuActivo.slug}
          variants={cambioDePantalla}
          initial="oculto"
          animate="visible"
          exit="salida"
          className="absolute inset-0"
        >
          <MenuScreen
            menu={menuActivo}
            playlist={{
              labels: etiquetas,
              activeIndex: indice,
              durationSeconds: duracion,
              paused: pausado,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
