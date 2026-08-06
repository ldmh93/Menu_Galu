import type { MenuGroup } from "./types";

/**
 * MALTEADAS — PENDIENTE DE DATOS.
 * Ver la nota de frozenYogurt.ts: misma estructura, solo faltan los productos.
 */
export const malteadas: MenuGroup = {
  slug: "malteadas",
  label: "Malteadas",
  screens: [
    {
      slug: "malteadas",
      title: "Malteadas",
      photo: {
        src: "/productos/malteadas.png",
        alt: "Malteada de GALU",
        fallbackIcon: "malteada",
      },
      categories: [],
    },
  ],
};
