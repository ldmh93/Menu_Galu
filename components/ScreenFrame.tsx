"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { CANVAS } from "@/config/site";

/**
 * Lienzo fijo de 1080x1920 escalado al viewport.
 *
 * Es el patron estandar de senalizacion digital: el diseno se compone una sola
 * vez en pixeles reales y se escala con `transform`, de modo que la pantalla se
 * ve EXACTAMENTE igual en un monitor vertical 1080p, en un 4K o en el navegador
 * del disenador. Nada de reflow, nada de breakpoints que rompan la composicion.
 */
export function ScreenFrame({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState<number | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const actualizar = () => {
      const { innerWidth, innerHeight } = window;
      setScale(
        Math.min(innerWidth / CANVAS.width, innerHeight / CANVAS.height),
      );
    };

    actualizar();
    window.addEventListener("resize", actualizar);
    window.addEventListener("orientationchange", actualizar);

    return () => {
      window.removeEventListener("resize", actualizar);
      window.removeEventListener("orientationchange", actualizar);
    };
  }, []);

  // Modo kiosco: esconde el cursor tras 4 s sin movimiento.
  useEffect(() => {
    let temporizador: ReturnType<typeof setTimeout>;

    const marcarInactivo = () => {
      document.body.dataset.kiosk = "idle";
    };

    const reiniciar = () => {
      document.body.dataset.kiosk = "active";
      clearTimeout(temporizador);
      temporizador = setTimeout(marcarInactivo, 4000);
    };

    reiniciar();
    window.addEventListener("mousemove", reiniciar);
    window.addEventListener("touchstart", reiniciar);

    return () => {
      clearTimeout(temporizador);
      delete document.body.dataset.kiosk;
      window.removeEventListener("mousemove", reiniciar);
      window.removeEventListener("touchstart", reiniciar);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-crema">
      {/*
        `shrink-0` es imprescindible: sin el, al ser hijo de un flex mas
        estrecho que 1080 px el lienzo se ENCOGERIA en lugar de escalarse, y
        la composicion se descuadraria entera. Pasa en cualquier ventana
        angosta: un celular, una tablet o el navegador sin maximizar.
      */}
      <div
        ref={contenedorRef}
        className="relative shrink-0 overflow-hidden transition-opacity duration-300"
        style={{
          width: CANVAS.width,
          height: CANVAS.height,
          transform: `scale(${scale ?? 1})`,
          transformOrigin: "center center",
          opacity: scale === null ? 0 : 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
