import {
  hasDescriptions,
  toMenuItem,
  type MenuCategory,
  type MenuItemInput,
  type MenuLayout,
} from "@/data/types";

/**
 * Reglas de composicion.
 *
 * Ni el numero de columnas ni el tamano de letra se escriben a mano: se deducen
 * del ancho real que va a tener la tarjeta en el lienzo de 1080 px y de la
 * longitud de los nombres. Asi la letra se mantiene lo mas grande posible
 * (legible desde lejos) sin que nada se desborde.
 */

/** Ancho del area de contenido del lienzo (1080 - 2 x 64 de margen). */
const ANCHO_CONTENIDO = 952;
/** Calle entre tarjetas. */
const CALLE_TARJETAS = 28;
/** Calle entre columnas dentro de una lista. */
const CALLE_COLUMNAS = 36;
/** Espacio ocupado por la vineta y su separacion. */
const ANCHO_VINETA = 26;
/** Ancho medio de un caracter respecto al tamano de fuente en Poppins Medium. */
const FACTOR_CARACTER = 0.54;
/**
 * Factor con margen, para decidir el tamano de letra.
 * Palabras con muchas letras anchas ("Manzana Verde", "Frambuesa") superan el
 * promedio, asi que al elegir la fuente se calcula con este valor mas holgado.
 */
const FACTOR_SEGURO = 0.6;
/** Tamano de fuente de referencia usado para estimar el ancho. */
const FUENTE_BASE = 30;

/** Papel de una tarjeta dentro de la composicion. */
export type Role = "hero" | "side" | "equal";

/** Relleno horizontal de la tarjeta (x2) segun su papel y su ancho. */
function relleno(role: Role, cards: number): number {
  if (role === "hero") return 112;
  return cards >= 3 ? 68 : 80;
}

/**
 * Ancho util (px) del area de texto de una tarjeta.
 * `cards` es cuantas tarjetas comparten la fila.
 */
export function anchoUtil(role: Role, cards: number): number {
  if (role === "hero") return ANCHO_CONTENIDO - relleno("hero", 1);

  const anchoTarjeta =
    (ANCHO_CONTENIDO - CALLE_TARJETAS * (cards - 1)) / Math.max(1, cards);

  return anchoTarjeta - relleno(role, cards);
}

function nombreMasLargo(items: MenuItemInput[]): number {
  return items.reduce(
    (max, item) => Math.max(max, toMenuItem(item).name.length),
    0,
  );
}

/**
 * Longitud de nombre en el percentil dado.
 *
 * Para elegir el tamano de letra no conviene mirar el nombre mas largo: un solo
 * "Algodon De Azucar" encogeria toda la carta. Miramos el percentil 85 — la
 * inmensa mayoria entra en una linea y la excepcion se parte en dos, que se lee
 * perfectamente gracias a la sangria francesa de ProductList.
 */
function longitudPercentil(items: MenuItemInput[], percentil: number): number {
  if (items.length === 0) return 1;

  const longitudes = items
    .map((item) => toMenuItem(item).name.length)
    .sort((a, b) => a - b);

  const indice = Math.min(
    longitudes.length - 1,
    Math.max(0, Math.ceil(percentil * longitudes.length) - 1),
  );

  return longitudes[indice];
}

/**
 * Columnas internas de la lista.
 * Nunca devuelve mas columnas de las que caben sin partir el nombre mas largo.
 */
export function columnsFor(
  role: Role,
  cards: number,
  items: MenuItemInput[],
): number {
  const util = anchoUtil(role, cards);
  const anchoTextoMax =
    nombreMasLargo(items) * FUENTE_BASE * FACTOR_CARACTER + ANCHO_VINETA;

  const columnasQueCaben = Math.max(
    1,
    Math.floor((util + CALLE_COLUMNAS) / (anchoTextoMax + CALLE_COLUMNAS)),
  );

  const conDescripcion = hasDescriptions(items);

  // Cuantas columnas convienen: se busca que ninguna lista pase de un numero
  // razonable de renglones. Con ingredientes el renglon es el doble de alto,
  // asi que se reparte antes; y en una tarjeta ancha se reparte aun antes,
  // porque una sola columna dejaria medio metro de vacio a la derecha.
  const anchaDeVerdad = util > 600;
  const filasIdeales = conDescripcion
    ? anchaDeVerdad
      ? 5
      : 7
    : anchaDeVerdad
      ? 8
      : 11;
  const deseadas = Math.max(1, Math.ceil(items.length / filasIdeales));

  // Con ingredientes nunca mas de 2 columnas: la descripcion necesita ancho.
  const tope = conDescripcion ? 2 : role === "hero" ? 3 : 2;

  return Math.min(columnasQueCaben, deseadas, tope);
}

/** Limites tipograficos por papel: nunca mas grande, nunca ilegible. */
const FUENTE: Record<Role, { min: number; max: number }> = {
  hero: { min: 23, max: 32 },
  side: { min: 23, max: 31 },
  equal: { min: 22, max: 30 },
};

/** Con ingredientes debajo, el nombre baja un punto para no engordar el renglon. */
const TOPE_CON_DESCRIPCION: Record<Role, number> = {
  hero: 29,
  side: 28,
  equal: 26,
};

/**
 * Tope de fuente segun cuantos productos hay.
 *
 * Una lista de siete tamanos no debe leerse igual de pequena que una de
 * cuarenta sabores: si sobra sitio, la letra crece. Es lo que hace que la
 * pantalla de Frozen Yogurt se lea desde el otro lado del local.
 */
function topePorCantidad(items: MenuItemInput[], role: Role): number {
  const conDescripcion = hasDescriptions(items);
  const base = conDescripcion ? TOPE_CON_DESCRIPCION[role] : FUENTE[role].max;

  if (items.length <= 8) return conDescripcion ? 36 : 40;
  if (items.length <= 12) return conDescripcion ? 32 : 34;

  return base;
}

/** Tamano de fuente de la lista para UNA categoria. Ver `sharedFontSize`. */
export function fontSizeFor(
  role: Role,
  cards: number,
  items: MenuItemInput[],
  columns: number,
): number {
  const anchoColumna =
    (anchoUtil(role, cards) - CALLE_COLUMNAS * (columns - 1)) / columns;

  /*
   * Con UNA columna se puede tolerar que el nombre mas largo se parta en dos:
   * la sangria francesa lo resuelve y no afecta a nadie mas. Con VARIAS, un
   * nombre partido estira toda la fila de la rejilla y deja huecos en las otras
   * columnas, asi que ahi la letra se calcula para que NINGUN nombre se parta.
   */
  const caracteres = Math.max(
    1,
    columns > 1 ? nombreMasLargo(items) : longitudPercentil(items, 0.85),
  );
  const ideal = (anchoColumna - ANCHO_VINETA) / (caracteres * FACTOR_SEGURO);

  const { min } = FUENTE[role];
  const max = topePorCantidad(items, role);

  return Math.round(Math.min(max, Math.max(min, ideal)));
}

/**
 * Tamano de fuente COMPARTIDO por las tarjetas que van una junto a otra.
 *
 * Si cada tarjeta eligiera su propio tamano, tres tarjetas vecinas tendrian
 * tres tipografias distintas y el conjunto se veria descuidado. Se toma el
 * menor de los calculados para que todas coincidan.
 */
export function sharedFontSize(
  role: Role,
  cards: number,
  categories: MenuCategory[],
  columnsOf: (category: MenuCategory) => number,
): number {
  if (categories.length === 0) return FUENTE[role].max;

  return categories.reduce(
    (min, category) =>
      Math.min(
        min,
        fontSizeFor(role, cards, category.items, columnsOf(category)),
      ),
    Number.POSITIVE_INFINITY,
  );
}

/**
 * Columnas definitivas de una categoria: respeta el valor declarado en los
 * datos y, si no hay, lo calcula.
 */
export function columnsOfCategory(
  role: Role,
  cards: number,
  category: MenuCategory,
): number {
  return category.columns ?? columnsFor(role, cards, category.items);
}

/**
 * Elige la distribucion automaticamente cuando el menu no la declara.
 *
 * Con una o dos categorias la respuesta es obvia. Con tres, si una tiene casi
 * tantos productos como las otras dos juntas conviene darle una tarjeta ancha
 * propia (`feature`) en lugar de tres columnas estrechas.
 */
export function resolveLayout(
  declared: MenuLayout | undefined,
  categories: MenuCategory[],
): MenuLayout {
  if (declared) return declared;
  if (categories.length <= 1) return "solo";
  if (categories.length === 2) return "duo";
  if (categories.length > 3) return "feature";

  const counts = categories.map((category) => category.items.length);
  const largest = Math.max(...counts);
  const rest = counts.reduce((sum, count) => sum + count, 0) - largest;

  return largest > rest * 0.9 || largest > 14 ? "feature" : "trio";
}

/** Cuantas tarjetas comparten fila en cada distribucion. */
export function cardsPerRow(layout: MenuLayout, total: number): number {
  if (layout === "solo") return 1;
  if (layout === "duo") return 2;
  if (layout === "trio") return 3;
  return Math.max(1, total - 1); // feature: el resto va bajo la principal
}
