"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Capa atmosferica sobre el fondo oficial.
 *
 * Aporta dos cosas que suben mucho la percepcion de calidad sin tocar el arte:
 *  1. Halos pastel que se desplazan muy lento (sensacion de profundidad).
 *  2. Un velo crema y una vineta suave que aumentan el contraste de las
 *     tarjetas — clave para leer desde lejos.
 */

interface Halo {
  color: string;
  size: number;
  x: string;
  y: string;
  duration: number;
  delay: number;
}

const halos: Halo[] = [
  { color: "rgba(247,191,217,0.55)", size: 760, x: "-14%", y: "6%", duration: 34, delay: 0 },
  { color: "rgba(157,210,197,0.42)", size: 820, x: "62%", y: "34%", duration: 42, delay: 3 },
  { color: "rgba(209,206,233,0.5)", size: 700, x: "12%", y: "68%", duration: 38, delay: 6 },
  { color: "rgba(255,232,116,0.34)", size: 620, x: "58%", y: "84%", duration: 46, delay: 2 },
];

export function AnimatedBackground() {
  const reducirMovimiento = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {halos.map((halo, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-[120px]"
          style={{
            width: halo.size,
            height: halo.size,
            left: halo.x,
            top: halo.y,
            background: `radial-gradient(circle at 50% 50%, ${halo.color} 0%, transparent 70%)`,
          }}
          animate={
            reducirMovimiento
              ? undefined
              : {
                  x: [0, 34, -22, 0],
                  y: [0, -28, 20, 0],
                  opacity: [0.75, 1, 0.8, 0.75],
                }
          }
          transition={{
            duration: halo.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: halo.delay,
          }}
        />
      ))}

      {/* Velo crema: unifica la paleta y suaviza el arte bajo las tarjetas. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(255,245,245,0.62)_0%,rgba(255,245,245,0.2)_46%,transparent_74%)]" />

      {/* Vineta muy tenue: enfoca la mirada al centro de la pantalla. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_58%,rgba(59,42,77,0.09)_100%)]" />
    </div>
  );
}
