import type { Transition, Variants } from "framer-motion";

/**
 * Lenguaje de movimiento de GALU.
 * Regla: nada rebota, nada gira, nada dura menos de medio segundo.
 * Todo entra desde una distancia corta con una curva muy suave.
 */

export const EASE_SUAVE = [0.22, 1, 0.36, 1] as const;

export const transicionSuave: Transition = {
  duration: 0.9,
  ease: EASE_SUAVE,
};

/** Contenedor que reparte la entrada de sus hijos uno por uno. */
export const contenedor = (stagger = 0.16, delay = 0): Variants => ({
  oculto: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Entrada estandar: sube unos pixeles mientras aparece. */
export const subirYAparecer: Variants = {
  oculto: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: transicionSuave },
};

/** Entrada del logo: baja desde arriba. */
export const bajarYAparecer: Variants = {
  oculto: { opacity: 0, y: -46 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: EASE_SUAVE },
  },
};

/** Solo opacidad, para titulos. */
export const aparecer: Variants = {
  oculto: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: EASE_SUAVE } },
};

/** Entrada de tarjeta: escala casi imperceptible + desplazamiento. */
export const entradaTarjeta: Variants = {
  oculto: { opacity: 0, y: 46, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: EASE_SUAVE },
  },
};

/**
 * Transicion entre pantallas del autoplay.
 *
 * La entrada espera a que la salida termine. Antes las dos corrian a la vez y
 * durante ~300 ms se veia el texto fantasma de la pantalla saliente encima del
 * contenido nitido de la entrante: la lista de productos de un menu caia justo
 * sobre las pastillas de extras del siguiente y parecia un fallo de dibujado.
 *
 * La salida es corta y con curva de desaceleracion, asi que la pantalla vieja
 * se desvanece rapido; la entrada arranca despues, ya sobre el fondo limpio.
 * El fondo lo pinta ScreenFrame y nunca se va, asi que no hay parpadeo negro:
 * en el hueco se ve el arte pastel, no un vacio.
 */
export const cambioDePantalla: Variants = {
  oculto: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: EASE_SUAVE, delay: 0.35 },
  },
  salida: {
    opacity: 0,
    transition: { duration: 0.4, ease: EASE_SUAVE },
  },
};
