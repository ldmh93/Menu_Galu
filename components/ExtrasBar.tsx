"use client";

import type { MenuExtra } from "@/data/types";
import { formatPrice } from "@/lib/format";

/**
 * Complementos con costo aparte.
 *
 * Vive junto a las tarjetas, no en el pie: son una extension del menu ("a lo
 * que acabas de leer le puedes anadir esto"), asi que tienen que leerse como
 * parte del mismo bloque. En el pie quedaban colgados del borde inferior con
 * un hueco muerto en medio cuando el menu tenia pocos productos.
 *
 * Son venta adicional, asi que se leen desde lejos: el nombre en tinta plena
 * y el precio en morado de marca, un punto mas grande. El ojo salta de precio
 * en precio, que es como se lee una lista de complementos.
 */
export function ExtrasBar({ extras }: { extras?: MenuExtra[] }) {
  if (!extras || extras.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <span className="mr-1 text-[22px] font-semibold tracking-[0.18em] text-morado uppercase">
        Extras
      </span>
      {extras.map((extra) => (
        <span
          key={extra.name}
          className="inline-flex items-baseline gap-2 rounded-full bg-white/90 px-4 py-2 text-[26px] font-medium whitespace-nowrap text-tinta"
          style={{
            border: "1px solid rgb(147 113 176 / 0.28)",
            boxShadow: "0 8px 20px -12px rgb(59 42 77 / 0.35)",
          }}
        >
          {extra.name}
          <span className="text-[28px] font-semibold text-morado">
            {formatPrice(extra.price)}
          </span>
        </span>
      ))}
    </div>
  );
}
