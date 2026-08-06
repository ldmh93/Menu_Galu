"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

import { cx } from "@/lib/format";

interface PlaylistProgressProps {
  /** Etiqueta del menu al que pertenece cada pantalla de la secuencia. */
  labels: string[];
  activeIndex: number;
  /** Segundos que dura cada pantalla. */
  durationSeconds: number;
  paused?: boolean;
}

interface Segmento {
  label: string;
  inicio: number;
  total: number;
}

/**
 * Indicador segmentado de la lista de reproduccion.
 *
 * Agrupa las pantallas por menu: Bobas ocupa cinco pantallas pero se muestra
 * como UNA sola barra que se llena poco a poco. Asi el cliente entiende cuantas
 * cartas hay y cuanto falta, sin ver diez marcas sueltas.
 */
export function PlaylistProgress({
  labels,
  activeIndex,
  durationSeconds,
  paused = false,
}: PlaylistProgressProps) {
  // Etiquetas consecutivas iguales = un solo segmento.
  const segmentos = useMemo(() => {
    return labels.reduce<Segmento[]>((acc, label, index) => {
      const ultimo = acc[acc.length - 1];
      if (ultimo && ultimo.label === label) {
        ultimo.total += 1;
      } else {
        acc.push({ label, inicio: index, total: 1 });
      }
      return acc;
    }, []);
  }, [labels]);

  return (
    <div className="flex items-center gap-3">
      {segmentos.map((segmento) => {
        const posicion = activeIndex - segmento.inicio;
        const activo = posicion >= 0 && posicion < segmento.total;
        const visto = activeIndex >= segmento.inicio + segmento.total;

        // Dentro de un menu de varias pantallas la barra avanza por tramos.
        const desde = activo ? (posicion / segmento.total) * 100 : 0;
        const hasta = activo ? ((posicion + 1) / segmento.total) * 100 : 0;

        return (
          <div
            key={segmento.label}
            className={cx(
              "relative h-[6px] overflow-hidden rounded-full transition-all duration-700",
              activo ? "w-28" : "w-[10px]",
            )}
            style={{ backgroundColor: "rgba(59,42,77,0.14)" }}
            aria-label={segmento.label}
            aria-current={activo ? "true" : undefined}
          >
            {activo ? (
              /*
                Se anima `scaleX`, NO `width`.
                Animar el ancho obliga al navegador a recalcular el diseño y
                repintar en CADA cuadro, y como esta barra corre sin parar los
                12 segundos que dura la pantalla, el repintado no cesaba nunca.
                Peor aun: al repintar el fondo, las tarjetas con `backdrop-filter`
                tenian que volver a leer y desenfocar todo lo que hay detras.
                Medido: 6116 rasterizados en 15 s. `scaleX` lo resuelve el
                compositor en la GPU, sin diseño ni pintado.
                El borde redondeado lo pone el contenedor, que ya recorta.
              */
              <motion.span
                key={`${segmento.label}-${activeIndex}`}
                className="absolute inset-y-0 left-0 w-full origin-left bg-[#9371b0]"
                initial={{ scaleX: desde / 100 }}
                animate={{ scaleX: (paused ? desde : hasta) / 100 }}
                transition={{ duration: durationSeconds, ease: "linear" }}
              />
            ) : visto ? (
              <span className="absolute inset-0 rounded-full bg-[#9371b0]/45" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
