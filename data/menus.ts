import { site } from "@/config/site";
import { blizz } from "./blizz";
import { bobas } from "./bobas";
import { especialidades } from "./especialidades";
import { frozenYogurt } from "./frozenYogurt";
import { iceRollers } from "./iceRollers";
import { malteadas } from "./malteadas";
import { sodasItalianas } from "./sodasItalianas";
import type { MenuGroup, MenuScreen } from "./types";

/**
 * Registro unico de menus.
 *
 * Un menu es un GRUPO de pantallas: Ice Rollers cabe en una, pero Bobas necesita
 * cinco. Las rutas usan el grupo; el autoplay aplana todos los grupos de la
 * lista de reproduccion en una sola secuencia de pantallas.
 *
 * El dia de manana `getGroup` / `getPlaylist` pueden volverse async contra la
 * API del panel administrativo sin tocar ni un componente.
 */
const registry: MenuGroup[] = [
  iceRollers,
  bobas,
  frozenYogurt,
  sodasItalianas,
  blizz,
  malteadas,
  especialidades,
];

export const groups: Record<string, MenuGroup> = Object.fromEntries(
  registry.map((group) => [group.slug, group]),
);

export function getGroup(slug: string): MenuGroup | undefined {
  return groups[slug];
}

/** Grupos en el orden de reproduccion definido en config/site.ts. */
export function getPlaylistGroups(): MenuGroup[] {
  const ordered = site.playlist
    .map((slug) => groups[slug])
    .filter((group): group is MenuGroup => Boolean(group))
    // Una pantalla sin categorias es un menu pendiente de datos: no se emite.
    .filter((group) => group.screens.some((screen) => screen.categories.length));

  return ordered.length > 0 ? ordered : [iceRollers];
}

/** Todas las pantallas de la lista de reproduccion, en secuencia. */
export function getPlaylistScreens(): MenuScreen[] {
  return getPlaylistGroups().flatMap((group) => group.screens);
}

/**
 * Etiqueta que corresponde a cada pantalla de la secuencia.
 * Sirve para que el indicador de progreso agrupe las 5 pantallas de Bobas
 * bajo un solo nombre en lugar de mostrar cinco marcas sueltas.
 */
export function getPlaylistLabels(): string[] {
  return getPlaylistGroups().flatMap((group) =>
    group.screens.map(() => group.label),
  );
}

export function getAllSlugs(): string[] {
  return registry.map((group) => group.slug);
}
