import type { MenuGroup } from "./types";

/**
 * ESPECIALIDADES — PENDIENTE DE DATOS.
 * Ver la nota de frozenYogurt.ts: misma estructura, solo faltan los productos.
 */
export const especialidades: MenuGroup = {
  slug: "especialidades",
  label: "Especialidades",
  screens: [
    {
      slug: "especialidades",
      title: "Especialidades",
      photo: {
        src: "/productos/especialidades.png",
        alt: "Postre especial de GALU",
        fallbackIcon: "postre",
      },
      categories: [],
    },
  ],
};
