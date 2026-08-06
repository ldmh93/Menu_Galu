"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

import { toMenuItem, type ItemTag, type MenuItemInput } from "@/data/types";
import type { AccentTokens } from "@/lib/accents";
import { cx, formatPrice } from "@/lib/format";
import { contenedor, EASE_SUAVE } from "@/lib/motion";

interface ProductListProps {
  items: MenuItemInput[];
  columns: number;
  accent: AccentTokens;
  /** Tamano de fuente en px. Lo calcula lib/layout.ts. */
  fontSize?: number;
}

const iconos: Record<ItemTag, typeof Sparkles> = {
  nuevo: Sparkles,
  favorito: Heart,
};

const etiquetas: Record<ItemTag, string> = {
  nuevo: "Nuevo",
  favorito: "Favorito",
};

/**
 * Lista de productos de una categoria.
 * Reparte en N columnas por orden de lectura vertical (columna por columna),
 * que es como el ojo recorre una carta impresa.
 */
export function ProductList({
  items,
  columns,
  accent,
  fontSize = 30,
}: ProductListProps) {
  const normalizados = items.map(toMenuItem);
  const separacion = Math.max(4, Math.round(fontSize * 0.2));

  return (
    <motion.ul
      variants={contenedor(0.03, 0.12)}
      className={cx("grid", columns > 1 ? "gap-x-9" : "gap-x-0")}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoFlow: "column",
        gridTemplateRows: `repeat(${Math.ceil(
          normalizados.length / columns,
        )}, auto)`,
      }}
    >
      {normalizados.map((item) => {
        const Icono = item.tag ? iconos[item.tag] : null;

        return (
          <motion.li
            key={item.name}
            variants={{
              oculto: { opacity: 0, x: -12 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.55, ease: EASE_SUAVE },
              },
            }}
            className="flex items-start gap-3"
            style={{ paddingBlock: separacion }}
          >
            {/* La vineta se alinea con la PRIMERA linea: si el nombre se parte
                en dos, la segunda queda sangrada debajo del texto. */}
            <span
              aria-hidden="true"
              className="size-[8px] shrink-0 rounded-full"
              style={{
                backgroundColor: accent.base,
                marginTop: Math.round(fontSize * 0.5),
              }}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-3">
                <span
                  className="font-[family-name:var(--font-body)] font-medium text-tinta"
                  style={{ fontSize, lineHeight: 1.24 }}
                >
                  {item.name}
                  {/* La insignia va DENTRO del nombre para que se quede pegada
                      a la ultima palabra aunque el nombre ocupe dos lineas. */}
                  {Icono && item.tag ? (
                    <span
                      className="ml-2 inline-flex translate-y-[0.12em] items-center justify-center rounded-full align-baseline"
                      style={{
                        backgroundColor: accent.base,
                        padding: Math.round(fontSize * 0.18),
                      }}
                      title={etiquetas[item.tag]}
                    >
                      <Icono
                        size={Math.round(fontSize * 0.56)}
                        strokeWidth={2.4}
                        style={{ color: accent.onBase }}
                        aria-label={etiquetas[item.tag]}
                      />
                    </span>
                  ) : null}
                </span>

                {item.note ? (
                  <span
                    className="font-semibold whitespace-nowrap text-tinta-suave"
                    style={{
                      fontSize: Math.round(fontSize * 0.74),
                      marginTop: Math.round(fontSize * 0.22),
                    }}
                  >
                    {item.note}
                  </span>
                ) : null}

                {/* Precio propio del renglon: se alinea a la derecha, como en
                    una carta impresa. */}
                {item.price !== undefined ? (
                  <span
                    className="ml-auto font-[family-name:var(--font-body)] font-semibold tabular-nums whitespace-nowrap text-tinta"
                    style={{ fontSize, lineHeight: 1.24 }}
                  >
                    {formatPrice(item.price)}
                  </span>
                ) : null}
              </div>

              {/* Ingredientes de las combinaciones */}
              {item.description ? (
                <p
                  className="font-light text-tinta-suave"
                  style={{
                    fontSize: Math.round(fontSize * 0.66),
                    lineHeight: 1.3,
                    marginTop: 2,
                  }}
                >
                  {item.description}
                </p>
              ) : null}
            </div>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
