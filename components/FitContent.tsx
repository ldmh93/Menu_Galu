"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

interface FitContentProps {
  children: ReactNode;
  /** Reduccion maxima permitida. 0.74 = como mucho un 26% mas pequeno. */
  minScale?: number;
  /**
   * Ampliacion maxima. Se deja en 1 a proposito: los tamanos de letra ya se
   * calculan en lib/layout.ts contra el ancho real de cada tarjeta, y ampliar
   * el bloque estrecharia las columnas y partiria los nombres en dos lineas.
   */
  maxScale?: number;
}

/**
 * Ajuste automatico de densidad.
 *
 * Un menu puede tener 40 productos y otro 18. En lugar de recortar contenido,
 * dejar que se desborde o abandonar un hueco enorme, medimos el bloque de
 * tarjetas y lo ajustamos a la altura disponible: se encoge lo justo cuando
 * sobra contenido y crece un poco cuando falta.
 *
 * La medicion se hace SIEMPRE con el bloque a su tamano natural (se anula el
 * transform antes de medir), de modo que el resultado no depende de la escala
 * anterior y no puede entrar en un bucle de reajustes.
 */
export function FitContent({
  children,
  minScale = 0.62,
  maxScale = 1,
}: FitContentProps) {
  const exteriorRef = useRef<HTMLDivElement>(null);
  const interiorRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const exterior = exteriorRef.current;
    const interior = interiorRef.current;
    if (!exterior || !interior) return;

    const medir = () => {
      const disponible = exterior.clientHeight;
      if (!disponible) return;

      // Medicion a tamano natural.
      const anchoPrevio = interior.style.width;
      const margenPrevio = interior.style.marginLeft;
      const transformPrevio = interior.style.transform;

      interior.style.width = "100%";
      interior.style.marginLeft = "0px";
      interior.style.transform = "none";

      const necesario = interior.scrollHeight;

      interior.style.width = anchoPrevio;
      interior.style.marginLeft = margenPrevio;
      interior.style.transform = transformPrevio;

      if (!necesario) return;

      const siguiente = Math.min(
        maxScale,
        Math.max(minScale, disponible / necesario),
      );

      setScale((actual) =>
        Math.abs(actual - siguiente) > 0.005 ? siguiente : actual,
      );
    };

    medir();

    // Solo observamos el contenedor: el interior cambia de ancho por nuestra
    // propia escala y observarlo provocaria un bucle.
    const observer = new ResizeObserver(medir);
    observer.observe(exterior);

    // Las fuentes web cambian la altura al cargar: volvemos a medir despues.
    document.fonts?.ready.then(medir).catch(() => undefined);

    return () => observer.disconnect();
  }, [minScale, maxScale, children]);

  return (
    // Centrado vertical: cuando un menu tiene pocos productos, el bloque queda
    // equilibrado en el hueco en lugar de colgar de la parte superior.
    <div
      ref={exteriorRef}
      // `overflow-hidden` es la ultima red de seguridad: si algun dia un menu
      // creciera tanto que ni al minimo cupiera, se recorta por abajo en lugar
      // de montarse sobre el titulo.
      className="flex h-full w-full flex-col justify-center overflow-hidden"
    >
      <div
        ref={interiorRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          width: `${100 / scale}%`,
          marginLeft: `${(100 / scale - 100) / -2}%`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
