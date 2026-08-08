"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";

import { site, type SocialNetwork } from "@/config/site";
import { TikTok } from "./icons/TikTok";
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

/**
 * Icono de una red social. TikTok es solido y los de Lucide son de trazo;
 * a 24 px y en el mismo morado se leen como un conjunto.
 */
function IconoRed({ red }: { red: SocialNetwork }) {
  if (red === "facebook") return <Facebook size={24} strokeWidth={2} />;
  if (red === "tiktok") return <TikTok size={23} />;
  return <Instagram size={24} strokeWidth={2} />;
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
      {/*
        Extras: son venta adicional, asi que tienen que leerse desde lejos.
        El nombre va en tinta plena (no en tinta-suave) y el precio en morado
        de marca, un punto mas grande y semibold: el ojo salta de precio en
        precio. El borde tenido de morado y la sombra despegan la pastilla del
        fondo pastel sin recurrir a un color fuerte.
      */}
      {extras && extras.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[22px] font-semibold tracking-[0.18em] text-morado uppercase">
            Extras
          </span>
          {extras.map((extra) => (
            <span
              key={extra.name}
              className="inline-flex items-baseline gap-2 rounded-full bg-white/90 px-4 py-2 text-[26px] font-medium whitespace-nowrap text-tinta"
              style={{
                border: "1px solid rgb(147 113 176 / 0.28)",
                boxShadow: "0 8px 20px -12px rgb(59 42 77 / 0.35)",
              }}
            >
              {extra.name}
              <span className="text-[28px] font-semibold text-morado">
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

        {/*
          El usuario es el mismo en las tres redes, asi que se escribe una
          sola vez y los iconos hacen de prefijo. Repetir "@frozen.galu" tres
          veces no aportaria nada y se comeria el ancho de la barra de
          progreso, que comparte esta fila.
        */}
        <span className="inline-flex shrink-0 items-center gap-3 text-[24px] font-medium whitespace-nowrap text-tinta">
          <span className="inline-flex items-center gap-2.5 text-morado">
            {site.footer.networks.map((red) => (
              <IconoRed key={red} red={red} />
            ))}
          </span>
          {site.footer.handle}
        </span>
      </div>
    </motion.footer>
  );
}
