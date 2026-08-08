/**
 * Configuracion global de la pantalla.
 *
 * Todo lo editable por el negocio vive aqui o en /data. Cuando exista el panel
 * administrativo, este objeto es lo unico que hay que reemplazar por un fetch:
 *   const site = await getSiteConfig()   // en vez de importar la constante
 */

export interface SiteConfig {
  /** Nombre de la marca (texto alternativo del logo). */
  brand: string;
  /** Subtitulo bajo el logo. Editable sin tocar componentes. */
  subtitle: string;
  /** Ruta del logo dentro de /public. */
  logo: string;
  /** Ruta del fondo oficial dentro de /public. NO modificar el arte. */
  background: string;
  /** Segundos que permanece visible cada PANTALLA en modo autoplay. */
  autoplaySeconds: number;
  /**
   * Orden de reproduccion (slugs de grupo de /data/menus.ts).
   * Los menus sin productos cargados se saltan automaticamente.
   */
  playlist: string[];
  /** Pie de pantalla. */
  footer: {
    handle: string;
    message: string;
  };
}

export const site: SiteConfig = {
  brand: "GALU",
  subtitle: "Frozen Yogurt & Bobas",
  logo: "/logo.png",
  background: "/background.svg",
  autoplaySeconds: 12,
  // Bobas aporta 5 pantallas y el resto 1 cada uno: el ciclo dura ~108 s.
  // Malteadas y Especialidades estan pendientes de datos y se omiten solos.
  playlist: [
    "ice-rollers",
    "bobas",
    "frozen-yogurt",
    "sodas-italianas",
    "blizz",
    "malteadas",
    "especialidades",
  ],
  footer: {
    handle: "@galu",
    message: "Hecho al momento, siempre fresco",
  },
};

/** Dimensiones del lienzo de diseno. Todo se escala a partir de aqui. */
export const CANVAS = {
  width: 1080,
  height: 1920,
} as const;
