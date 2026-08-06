"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { site } from "@/config/site";
import { bajarYAparecer } from "@/lib/motion";

const RELACION_ASPECTO = 266 / 108; // dimensiones nativas de /public/logo.png

interface LogoProps {
  /** Ancho renderizado en px del lienzo 1080x1920. */
  width?: number;
  priority?: boolean;
}

/**
 * Logo de GALU con entrada descendente.
 * Se apoya en un halo blanco muy difuso para separarlo del arte del fondo sin
 * necesidad de recuadros ni marcos.
 */
export function Logo({ width = 330, priority = true }: LogoProps) {
  const height = Math.round(width / RELACION_ASPECTO);

  return (
    <motion.div
      variants={bajarYAparecer}
      className="relative flex items-center justify-center"
      style={{ width, height }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -m-14 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgb(255 255 255 / 0.55) 0%, rgb(255 255 255 / 0.35) 40%, transparent 70%)",
        }}
      />
      <Image
        src={site.logo}
        alt={site.brand}
        width={width}
        height={height}
        priority={priority}
        sizes={`${width}px`}
        className="relative h-full w-full object-contain"
        draggable={false}
      />
    </motion.div>
  );
}
