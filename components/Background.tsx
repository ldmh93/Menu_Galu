"use client";

import { motion, useReducedMotion } from "framer-motion";

import { site } from "@/config/site";

/**
 * Fondo oficial de GALU.
 * El arte NO se modifica: se muestra tal cual, cubriendo el lienzo completo,
 * con una deriva casi imperceptible para que la pantalla nunca se sienta
 * congelada (importante en televisores encendidos todo el dia).
 */
export function Background() {
  const reducirMovimiento = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/*
        Solo se desplaza; NO se anima la escala.
        Al cambiar la escala de forma continua el navegador tiene que volver a
        rasterizar el SVG del fondo (que es vectorial y muy detallado) para
        mantener la nitidez, cuadro tras cuadro y para siempre. Un
        desplazamiento, en cambio, lo resuelve el compositor moviendo una
        textura ya dibujada. La escala fija de 1.06 se queda: evita que se vean
        los bordes al desplazarse.
      */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: 1.06, willChange: "transform" }}
        animate={reducirMovimiento ? undefined : { x: [0, -14, 0], y: [0, 11, 0] }}
        transition={{
          duration: 46,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={site.background}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}
