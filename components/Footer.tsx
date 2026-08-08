"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";

import { site, type SocialNetwork } from "@/config/site";
import { TikTok } from "./icons/TikTok";
import { EASE_SUAVE } from "@/lib/motion";
import { PlaylistProgress } from "./PlaylistProgress";

interface FooterProps {
  /** Nota al pie propia del menu (p. ej. "Disponibles en 16 y 24 oz"). */
  footnote?: string;
  /** Datos del indicador de reproduccion. Se omite en las rutas estaticas. */
  playlist?: {
    labels: string[];
    activeIndex: number;
    durationSeconds: number;
    paused?: boolean;
  };
}

/**
 * Icono de una red social. TikTok es solido y los de Lucide son de trazo,
 * asi que va un punto mas pequeno: a igual altura una silueta llena pesa
 * mas que un contorno. En el mismo morado se leen como un conjunto.
 */
function IconoRed({ red }: { red: SocialNetwork }) {
  if (red === "facebook") return <Facebook size={28} strokeWidth={2} />;
  if (red === "tiktok") return <TikTok size={26} />;
  return <Instagram size={28} strokeWidth={2} />;
}

/**
 * Pie de pantalla: nota del menu, progreso y marca.
 * Los extras NO van aqui: viajan pegados a las tarjetas (ver ExtrasBar).
 */
export function Footer({ footnote, playlist }: FooterProps) {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE_SUAVE, delay: 1.1 }}
      className="flex flex-col gap-4"
    >
      {/*
        La nota lleva condiciones de venta ("todos incluyen 2 toppings", "16 y
        24 oz"): si no se lee desde la fila, no sirve de nada.

        Aqui el tamano no era el problema principal: cae justo encima de la
        mancha lavanda del fondo, y el gris-morado (#6b5a7d) sobre lavanda
        (#d1cee9) da un contraste de ~3.5:1, que a varios metros se disuelve.
        En tinta plena (#3b2a4d) sube a ~7.5:1. El peso medio hace el resto:
        sigue por debajo de los productos en jerarquia, pero ya no se pierde.
      */}
      {footnote ? (
        <p className="text-[34px] leading-snug font-medium text-tinta">
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
          // Sin `nowrap`: comparte fila con el usuario de redes, que ahora es
          // mas ancho. Si no cupiera, preferimos dos lineas a un recorte.
          <span className="min-w-0 text-[24px] leading-snug font-normal text-tinta-suave">
            {site.footer.message}
          </span>
        )}

        {/*
          El usuario es el mismo en las tres redes, asi que se escribe una
          sola vez y los iconos hacen de prefijo. Repetir "@frozen.galu" tres
          veces no aportaria nada y se comeria el ancho de la barra de
          progreso, que comparte esta fila.
        */}
        <span className="inline-flex shrink-0 items-center gap-3 text-[30px] font-semibold whitespace-nowrap text-tinta">
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
