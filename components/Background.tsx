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
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.04 }}
        animate={
          reducirMovimiento
            ? { scale: 1.04 }
            : { scale: [1.04, 1.075, 1.04], x: [0, -10, 0], y: [0, 8, 0] }
        }
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
