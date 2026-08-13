/**
 * Contratos de datos del menu.
 *
 * Estos tipos son el "esquema" del futuro panel administrativo: el dia que los
 * datos vengan de una base de datos, los archivos de /data se sustituyen por
 * funciones async que devuelvan exactamente estas mismas formas.
 */

/** Acentos disponibles, tomados del fondo oficial de la marca. */
export type Accent = "rosa" | "lavanda" | "menta" | "amarillo" | "morado";

/** Etiquetas destacables de un producto. */
export type ItemTag = "nuevo" | "favorito";

export interface MenuItem {
  name: string;
  /** Ingredientes o composicion. Se muestra bajo el nombre, en letra ligera. */
  description?: string;
  /**
   * Precio propio del producto, alineado a la derecha. Se usa cuando cada
   * renglon cuesta distinto (p. ej. los tamanos del frozen yogurt) en lugar de
   * un precio unico para toda la categoria.
   */
  price?: number;
  /** Insignia opcional a la derecha del nombre. */
  tag?: ItemTag;
  /** Excepcion de precio o aclaracion corta, p. ej. "$79" o "+$10". */
  note?: string;
}

/** Un producto puede declararse como texto plano o como objeto completo. */
export type MenuItemInput = string | MenuItem;

/** Un precio por tamano: "16 oz" → $72. */
export interface PriceTier {
  label: string;
  value: number;
}

/** Precio unico, o varios precios por tamano. */
export type Price = number | PriceTier[];

export interface MenuCategory {
  id: string;
  /** Titulo de la tarjeta: "Agua", "Especiales", "Premium"... */
  name: string;
  /**
   * Precio unico o tabla de precios por tamano. Se omite cuando cada producto
   * lleva su propio precio (ver `MenuItem.price`).
   */
  price?: Price;
  /**
   * Fuerza el numero de columnas de la lista. Normalmente se deja sin poner y
   * lo calcula lib/layout.ts; sirve para listas tipo tarifa que se leen mejor
   * en una sola columna.
   */
  columns?: number;
  /** Linea de apoyo bajo el titulo (opcional). */
  description?: string;
  /** Color de acento de la tarjeta. */
  accent: Accent;
  items: MenuItemInput[];
}

/**
 * Distribucion de las tarjetas en pantalla.
 * - `solo`   → una unica tarjeta a todo lo ancho.
 * - `duo`    → dos tarjetas del mismo ancho.
 * - `trio`   → tres tarjetas del mismo ancho.
 * - `feature`→ una tarjeta principal ancha arriba y el resto debajo. Se usa
 *              cuando una categoria tiene muchos mas productos que las otras,
 *              para no sacrificar el tamano de letra.
 */
export type MenuLayout = "solo" | "duo" | "trio" | "feature";

export interface MenuPhoto {
  /** Ruta dentro de /public/productos. Si el archivo no existe se muestra un
   *  marcador elegante en lugar de romper la pantalla. */
  src: string;
  alt: string;
  /** Icono de respaldo mientras no haya fotografia. */
  fallbackIcon?: "helado" | "boba" | "yogurt" | "malteada" | "postre";
}

/** Complemento de pago aparte que se muestra como pastilla en el pie. */
export interface MenuExtra {
  name: string;
  price: number;
}

export interface MenuScreen {
  /** Identificador estable y slug de ruta: /menu/{slug}. */
  slug: string;
  /** Titulo grande de la pantalla. */
  title: string;
  /**
   * Seccion dentro del menu, en pastilla bajo el titulo. Se usa cuando un menu
   * ocupa varias pantallas: el titulo no cambia y la seccion si.
   */
  section?: string;
  /** Frase corta bajo el titulo. */
  tagline?: string;
  /**
   * Anula la forma de preparacion de config/site.ts en ESTA pantalla.
   * `null` la oculta (util si un menu no se sirve late ni frapeado).
   */
  preparation?: string | null;
  layout?: MenuLayout;
  photo: MenuPhoto;
  categories: MenuCategory[];
  /** Nota al pie especifica de este menu. */
  footnote?: string;
  /** Extras con costo adicional (leche vegetal, toppings...). */
  extras?: MenuExtra[];
}

/** Agrupacion de pantallas que pertenecen al mismo menu (p. ej. Bobas). */
export interface MenuGroup {
  /** Slug de la ruta: /menu/{slug}. */
  slug: string;
  /** Nombre corto para el indicador de reproduccion. */
  label: string;
  screens: MenuScreen[];
}

/** Normaliza `string | MenuItem` a `MenuItem`. */
export function toMenuItem(input: MenuItemInput): MenuItem {
  return typeof input === "string" ? { name: input } : input;
}

/** Normaliza cualquier precio a lista de tramos. */
export function toPriceTiers(price: Price | undefined): PriceTier[] {
  if (price === undefined) return [];
  return typeof price === "number" ? [{ label: "", value: price }] : price;
}

/** True si alguno de los productos trae descripcion de ingredientes. */
export function hasDescriptions(items: MenuItemInput[]): boolean {
  return items.some((item) => Boolean(toMenuItem(item).description));
}
