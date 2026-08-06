"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

import { site } from "@/config/site";
import type { MenuExtra } from "@/data/types";
import { formatPrice } from "@/lib/format";
import { EASE_SUAVE } from "@/lib/motion";
import { PlaylistProgress } from "./PlaylistProgress";

interface FooterProps {
  /** Nota al pie propia del menu (p. ej. "Disponibles en 16 y 24 oz"). */
  footnote?: string;
  /** Complementos con costo aparte. */
  extras?: MenuExtra[];
  /** Datos del indicador de reproduccion. Se omite en las rutas estaticas. */
  playlist?: {
    labels: string[];
    activeIndex: number;
    durationSeconds: number;
    paused?: boolean;
  };
}

/** Pie de pantalla: extras, nota del menu, progreso y marca. */
export function Footer({ footnote, extras, playlist }: FooterProps) {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE_SUAVE, delay: 1.1 }}
      className="flex flex-col gap-4"
    >
      {/* Extras: pastillas pequenas, informacion secundaria pero visible. */}
      {extras && extras.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[17px] font-medium tracking-[0.12em] text-tinta-suave/80 uppercase">
            Extras
          </span>
          {extras.map((extra) => (
            <span
              key={extra.name}
              className="inline-flex items-baseline gap-1.5 rounded-full bg-white/65 px-3 py-1.5 text-[18px] font-medium whitespace-nowrap text-tinta-suave"
              style={{ border: "1px solid rgb(255 255 255 / 0.8)" }}
            >
              {extra.name}
              <span className="font-semibold text-tinta">
                {formatPrice(extra.price)}
              </span>
            </span>
          ))}
        </div>
      ) : null}

      {footnote ? (
        <p className="text-[23px] leading-snug font-light text-tinta-suave">
          {footnote}
        </p>
      ) : null}

      {/* Progreso de la lista de reproduccion y firma de la marca. */}
      <div className="flex items-end justify-between gap-6">
        {playlist ? (
          <PlaylistProgress
            labels={playlist.labels}
            activeIndex={playlist.activeIndex}
            durationSeconds={playlist.durationSeconds}
            paused={playlist.paused}
          />
        ) : (
          <span className="text-[20px] font-light whitespace-nowrap text-tinta-suave">
            {site.footer.message}
          </span>
        )}

        <span className="inline-flex shrink-0 items-center gap-3 text-[24px] font-medium whitespace-nowrap text-tinta">
          <Instagram size={24} strokeWidth={2} className="text-[#9371b0]" />
          {site.footer.handle}
        </span>
      </div>
    </motion.footer>
  );
}
