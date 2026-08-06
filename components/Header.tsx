"use client";

import { motion } from "framer-motion";

import { site } from "@/config/site";
import { aparecer, contenedor } from "@/lib/motion";
import { Logo } from "./Logo";

interface HeaderProps {
  /** Permite sobrescribir el subtitulo por pantalla; por defecto usa config. */
  subtitle?: string;
}

/** Cabecera fija: logo + subtitulo editable. */
export function Header({ subtitle = site.subtitle }: HeaderProps) {
  return (
    <motion.header
      variants={contenedor(0.22)}
      initial="oculto"
      animate="visible"
      className="flex flex-col items-center"
    >
      <Logo />

      <motion.div variants={aparecer} className="mt-4 flex items-center gap-5">
        <Guion />
        <p className="font-[family-name:var(--font-body)] text-[27px] font-medium tracking-[0.4em] text-tinta-suave whitespace-nowrap uppercase">
          {subtitle}
        </p>
        <Guion />
      </motion.div>
    </motion.header>
  );
}

function Guion() {
  return (
    <span
      aria-hidden="true"
      className="h-px w-16 bg-gradient-to-r from-transparent via-[#9371b0]/45 to-transparent"
    />
  );
}
