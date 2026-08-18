"use client";

import { motion } from "framer-motion";

import { site } from "@/config/site";
import { aparecer, contenedor, subirYAparecer } from "@/lib/motion";

interface MenuTitleProps {
  title: string;
  /** Que son: la seccion dentro del menu. Va bajo el titulo, algo mas pequena. */
  section?: string;
  tagline?: string;
  /**
   * Forma de preparacion. Sin indicar usa la de config/site.ts;
   * `null` la oculta en esta pantalla.
   */
  preparation?: string | null;
}

/**
 * Titulo de la pantalla. Es el ancla visual: tipografia display muy grande,
 * ornamento minimo y mucho aire alrededor.
 *
 * Jerarquia de cuatro niveles:
 *   1. Producto     — "Bobas"                 98 px, Fredoka SemiBold, ciruela
 *   2. Que son      — "Combinaciones · Agua"  52 px, Fredoka Medium, morado
 *   3. Preparacion  — "Latte o Frapeado"       26 px, en pastilla
 *   4. Detalle      — frase corta             28 px, Poppins Light
 *
 * Cuando un menu ocupa varias pantallas (Bobas son cinco), el nivel 1 no cambia
 * nunca y lo que cambia es el nivel 2: asi el cliente siempre sabe que sigue
 * viendo la misma carta.
 */
export function MenuTitle({
  title,
  section,
  tagline,
  preparation = site.preparation,
}: MenuTitleProps) {
  return (
    <motion.div
      variants={contenedor(0.18, 0.25)}
      initial="oculto"
      animate="visible"
      className="flex flex-col items-center text-center"
    >
      <motion.h1
        variants={aparecer}
        className="font-[family-name:var(--font-display)] text-[98px] leading-[1.02] font-semibold text-tinta"
        style={{ letterSpacing: "-0.015em" }}
      >
        {title}
      </motion.h1>

      <motion.div
        variants={subirYAparecer}
        className="mt-4 flex items-center gap-4"
        aria-hidden="true"
      >
        <span className="h-[3px] w-20 rounded-full bg-[#f7bfd9]" />
        <span className="h-[10px] w-[10px] rounded-full bg-[#9371b0]/70" />
        <span className="h-[3px] w-20 rounded-full bg-[#9dd2c5]" />
      </motion.div>

      {section ? (
        <motion.p
          variants={subirYAparecer}
          className="mt-4 font-[family-name:var(--font-display)] text-[52px] leading-[1.08] font-medium text-balance text-[#6b4b8a]"
          style={{ letterSpacing: "-0.005em" }}
        >
          {section}
        </motion.p>
      ) : null}

      {/*
        Preparacion: es una opcion de servicio, no un nombre de producto, asi
        que va en pastilla y no como texto suelto. La pastilla la separa de la
        jerarquia de titulos de un vistazo y ocupa una sola linea corta (~49 px
        de alto), que es lo que se le puede robar al bloque de tarjetas.
      */}
      {preparation ? (
        <motion.p
          variants={subirYAparecer}
          className="mt-2.5 rounded-full px-6 py-1 text-[26px] font-medium whitespace-nowrap text-[#6b4b8a]"
          style={{
            background: "rgb(255 255 255 / 0.7)",
            border: "1px solid rgb(147 113 176 / 0.22)",
          }}
        >
          {preparation}
        </motion.p>
      ) : null}

      {tagline ? (
        <motion.p
          variants={subirYAparecer}
          className={`text-[28px] font-light text-tinta-suave ${
            section ? "mt-2" : "mt-4"
          }`}
        >
          {tagline}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
