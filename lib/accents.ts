import type { Accent } from "@/data/types";

/**
 * Traduccion de cada acento de marca a los valores concretos que usan las
 * tarjetas. Centralizado aqui para que ningun componente invente colores.
 */
export interface AccentTokens {
  /** Color plano del acento. */
  base: string;
  /** Version muy diluida para fondos. */
  wash: string;
  /** Color del texto sobre `base` (siempre legible a distancia). */
  onBase: string;
  /** Halo difuso detras de la tarjeta. */
  glow: string;
}

export const accents: Record<Accent, AccentTokens> = {
  rosa: {
    base: "#f7bfd9",
    wash: "rgba(247, 191, 217, 0.22)",
    onBase: "#5c2444",
    glow: "rgba(247, 191, 217, 0.55)",
  },
  lavanda: {
    base: "#d1cee9",
    wash: "rgba(209, 206, 233, 0.24)",
    onBase: "#3a3163",
    glow: "rgba(209, 206, 233, 0.6)",
  },
  menta: {
    base: "#9dd2c5",
    wash: "rgba(157, 210, 197, 0.22)",
    onBase: "#12463c",
    glow: "rgba(157, 210, 197, 0.5)",
  },
  amarillo: {
    base: "#ffe874",
    wash: "rgba(255, 232, 116, 0.24)",
    onBase: "#5a4405",
    glow: "rgba(255, 232, 116, 0.55)",
  },
  morado: {
    base: "#9371b0",
    wash: "rgba(147, 113, 176, 0.18)",
    onBase: "#ffffff",
    glow: "rgba(147, 113, 176, 0.4)",
  },
};

export function getAccent(accent: Accent): AccentTokens {
  return accents[accent] ?? accents.rosa;
}
