"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CakeSlice, CupSoda, IceCreamBowl, IceCreamCone, Milk } from "lucide-react";

import type { MenuPhoto } from "@/data/types";
import { EASE_SUAVE } from "@/lib/motion";

interface FloatingImageProps {
  photo: MenuPhoto;
  /** Lado del cuadro contenedor en px del lienzo. ~25% de 1920 = 480. */
  size?: number;
}

const iconosPorTipo = {
  helado: IceCreamCone,
  boba: CupSoda,
  yogurt: IceCreamBowl,
  malteada: Milk,
  postre: CakeSlice,
} as const;

/**
 * Fotografia del producto en la esquina inferior izquierda.
 *
 * No va enmarcada: sobresale del borde de la pantalla y flota muy despacio.
 * Si aun no existe el archivo en /public/productos, se dibuja un marcador
 * elegante en su lugar para que la pantalla nunca se vea rota.
 */
export function FloatingImage({ photo, size = 480 }: FloatingImageProps) {
  const [falloImagen, setFalloImagen] = useState(false);
  const reducirMovimiento = useReducedMotion();

  const Icono = iconosPorTipo[photo.fallbackIcon ?? "helado"];

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, ease: EASE_SUAVE, delay: 0.7 }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={
          reducirMovimiento
            ? undefined
            : { y: [0, -18, 0], rotate: [0, -1.1, 0] }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Sombra proyectada en el suelo, no en la imagen */}
        <div
          aria-hidden="true"
          className="absolute inset-x-[10%] bottom-[3%] h-[16%] rounded-[50%]"
          style={{
            background:
              "radial-gradient(closest-side, rgb(59 42 77 / 0.26) 0%, rgb(59 42 77 / 0.14) 45%, transparent 78%)",
          }}
        />

        {!falloImagen ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={`${size}px`}
            loading="lazy"
            onError={() => setFalloImagen(true)}
            className="object-contain drop-shadow-[0_40px_60px_rgba(59,42,77,0.28)]"
            draggable={false}
          />
        ) : (
          <MarcadorProducto Icono={Icono} label={photo.alt} />
        )}
      </motion.div>
    </motion.div>
  );
}

/** Marcador provisional mientras se cargan las fotografias definitivas. */
function MarcadorProducto({
  Icono,
  label,
}: {
  Icono: typeof IceCreamCone;
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className="vidrio relative flex h-full w-full items-center justify-center rounded-full"
      style={{ boxShadow: "var(--shadow-flotante)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-6 rounded-full bg-[radial-gradient(circle_at_36%_30%,rgba(255,255,255,0.95)_0%,rgba(247,191,217,0.42)_46%,rgba(209,206,233,0.34)_100%)]"
      />
      <Icono
        size={168}
        strokeWidth={1.15}
        className="relative text-[#9371b0]/70"
      />
    </div>
  );
}
