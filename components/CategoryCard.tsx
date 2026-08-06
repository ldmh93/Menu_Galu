"use client";

import { motion } from "framer-motion";

import { toPriceTiers, type MenuCategory, type Price } from "@/data/types";
import { getAccent, type AccentTokens } from "@/lib/accents";
import { formatPrice } from "@/lib/format";
import { entradaTarjeta } from "@/lib/motion";
import { ProductList } from "./ProductList";

interface CategoryCardProps {
  category: MenuCategory;
  /** Columnas internas de la lista de productos. */
  columns: number;
  /** Tamano de fuente de los productos, calculado en lib/layout.ts. */
  fontSize: number;
  /** Tarjeta protagonista (mas ancha) o secundaria. */
  emphasis?: "hero" | "normal";
  /** Tarjeta angosta (3 por fila): apila el precio sobre el titulo. */
  compact?: boolean;
  /**
   * Reserva sitio para dos lineas de titulo y una de descripcion aunque esta
   * tarjeta no las necesite. Sirve para que las listas de todas las tarjetas de
   * una misma fila arranquen a la misma altura.
   */
  reserveHeader?: boolean;
  className?: string;
}

/**
 * Tarjeta de categoria: titulo, precio y lista de productos.
 * Vidrio muy ligero, esquinas muy redondeadas, sombra difusa y un halo del
 * color de acento por detras. Sin bordes duros ni rejillas tipo tabla.
 */
export function CategoryCard({
  category,
  columns,
  fontSize,
  emphasis = "normal",
  compact = false,
  reserveHeader = false,
  className,
}: CategoryCardProps) {
  const accent = getAccent(category.accent);
  const esHero = emphasis === "hero";
  const TITULO_COMPACTO = 34;

  return (
    <motion.article
      variants={entradaTarjeta}
      className={`group relative flex flex-col ${className ?? ""}`}
    >
      {/* Halo de color detras de la tarjeta */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[64px] blur-[60px] opacity-70"
        style={{ background: accent.glow }}
      />

      <div
        className="vidrio brillo-superior relative flex h-full flex-col overflow-hidden rounded-[48px]"
        style={{
          boxShadow: "var(--shadow-tarjeta)",
          paddingLeft: esHero ? 56 : compact ? 34 : 40,
          paddingRight: esHero ? 56 : compact ? 34 : 40,
          paddingTop: esHero ? 40 : compact ? 34 : 36,
          paddingBottom: esHero ? 40 : compact ? 34 : 36,
        }}
      >
        {/* Cinta de acento superior */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[6px]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent.base} 22%, ${accent.base} 78%, transparent 100%)`,
          }}
        />

        {/* Lavado de color muy tenue en la esquina superior */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full blur-3xl"
          style={{ background: accent.wash }}
        />

        {compact ? (
          /* Tarjeta angosta: el precio va arriba, centrado, como una medalla.
             Asi nunca compite por el ancho con el nombre de la categoria. */
          <header className="relative flex flex-col items-center pb-5 text-center">
            <Precio price={category.price} accent={accent} size="normal" />
            <h2
              className="mt-4 flex items-center justify-center font-[family-name:var(--font-display)] font-semibold text-balance text-tinta"
              style={{
                fontSize: TITULO_COMPACTO,
                lineHeight: 1.08,
                letterSpacing: "-0.01em",
                // Dos lineas siempre: las tarjetas vecinas quedan alineadas.
                minHeight: reserveHeader ? TITULO_COMPACTO * 2.16 : undefined,
              }}
            >
              {category.name}
            </h2>
            {category.description || reserveHeader ? (
              <p
                className="mt-1.5 font-light text-balance text-tinta-suave"
                style={{ fontSize: 21, lineHeight: 1.3, minHeight: 27 }}
              >
                {category.description ?? " "}
              </p>
            ) : null}
          </header>
        ) : (
          <header
            className={`relative flex items-start justify-between gap-6 ${
              esHero ? "pb-6" : "pb-5"
            }`}
          >
            <div className="min-w-0">
              <h2
                className="font-[family-name:var(--font-display)] font-semibold text-tinta"
                style={{
                  fontSize: esHero ? 52 : 42,
                  lineHeight: 1.08,
                  letterSpacing: "-0.01em",
                }}
              >
                {category.name}
              </h2>
              {category.description || reserveHeader ? (
                <p
                  className="mt-1.5 font-light text-tinta-suave"
                  style={{
                    fontSize: esHero ? 25 : 22,
                    minHeight: esHero ? 33 : 29,
                  }}
                >
                  {category.description ?? " "}
                </p>
              ) : null}
            </div>

            <Precio
              price={category.price}
              accent={accent}
              size={esHero ? "grande" : "normal"}
            />
          </header>
        )}

        {/* Separador degradado, nunca una linea dura */}
        <span
          aria-hidden="true"
          className="relative h-px w-full"
          style={{
            background: `linear-gradient(90deg, ${accent.base} 0%, rgba(59,42,77,0.08) 55%, transparent 100%)`,
          }}
        />

        <div
          className={esHero ? "relative pt-6" : "relative pt-5"}
          style={compact ? { paddingLeft: 4 } : undefined}
        >
          <ProductList
            items={category.items}
            columns={columns}
            accent={accent}
            fontSize={fontSize}
          />
        </div>
      </div>
    </motion.article>
  );
}

/**
 * Precio de la categoria.
 * Con un solo importe es una pildora. Con varios tamanos (16 oz / 24 oz) es un
 * grupo de pildoras con el tamano encima del importe, para que desde lejos se
 * lea primero el numero grande y luego a que medida corresponde.
 */
function Precio({
  price,
  accent,
  size,
}: {
  price?: Price;
  accent: AccentTokens;
  size: "grande" | "normal";
}) {
  const tiers = toPriceTiers(price);
  const esGrande = size === "grande";

  // Sin precio de categoria: cada producto lleva el suyo en la lista.
  if (tiers.length === 0) return null;

  if (tiers.length === 1 && !tiers[0].label) {
    return (
      <div
        className="shrink-0 rounded-full"
        style={{
          backgroundColor: accent.base,
          color: accent.onBase,
          paddingInline: esGrande ? 30 : 24,
          paddingBlock: esGrande ? 12 : 10,
          boxShadow: "var(--shadow-pildora)",
        }}
      >
        <span
          className="font-[family-name:var(--font-body)] font-semibold tabular-nums"
          style={{ fontSize: esGrande ? 46 : 38, lineHeight: 1.15 }}
        >
          {formatPrice(tiers[0].value)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-stretch gap-2">
      {tiers.map((tier) => (
        <div
          key={tier.label}
          className="flex flex-col items-center rounded-[28px]"
          style={{
            backgroundColor: accent.base,
            color: accent.onBase,
            paddingInline: esGrande ? 22 : 18,
            paddingBlock: esGrande ? 10 : 8,
            boxShadow: "var(--shadow-pildora)",
          }}
        >
          <span
            className="font-[family-name:var(--font-body)] font-medium uppercase opacity-75"
            style={{
              fontSize: esGrande ? 18 : 16,
              letterSpacing: "0.12em",
              lineHeight: 1.2,
            }}
          >
            {tier.label}
          </span>
          <span
            className="font-[family-name:var(--font-body)] font-semibold tabular-nums"
            style={{ fontSize: esGrande ? 38 : 32, lineHeight: 1.15 }}
          >
            {formatPrice(tier.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
