"use client";

import { motion } from "framer-motion";

import {
  toPriceTiers,
  type MenuCategory,
  type MenuLayout,
  type MenuScreen as MenuScreenData,
} from "@/data/types";
import {
  cardsPerRow,
  columnsOfCategory,
  fontSizeFor,
  resolveLayout,
  sharedFontSize,
} from "@/lib/layout";
import { contenedor } from "@/lib/motion";
import { AnimatedBackground } from "./AnimatedBackground";
import { Background } from "./Background";
import { CategoryCard } from "./CategoryCard";
import { FitContent } from "./FitContent";
import { FloatingImage } from "./FloatingImage";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MenuTitle } from "./MenuTitle";

interface MenuScreenProps {
  menu: MenuScreenData;
  /** Subtitulo del header; por defecto el de config/site.ts. */
  subtitle?: string;
  /** Indicador de la lista de reproduccion (solo en modo autoplay). */
  playlist?: {
    labels: string[];
    activeIndex: number;
    durationSeconds: number;
    paused?: boolean;
  };
}

/** Ritmo vertical del lienzo 1080x1920. Un unico lugar donde ajustarlo. */
const RITMO = {
  paddingTop: 52,
  paddingX: 64,
  paddingBottom: 48,
  gapHeaderTitulo: 32,
  gapTituloContenido: 36,
  /** Franja inferior reservada para foto + pie. */
  bandaInferior: 260,
  /** Lado de la fotografia y cuanto sobresale de los bordes. */
  fotoTamano: 460,
  fotoDesbordeIzquierdo: 120,
  fotoDesbordeInferior: 110,
} as const;

/**
 * Una pantalla completa del menu: fondo, cabecera, titulo, tarjetas,
 * fotografia flotante y pie. Es el unico componente que conoce la composicion;
 * las rutas y el autoplay solo le pasan datos.
 */
export function MenuScreen({ menu, subtitle, playlist }: MenuScreenProps) {
  const layout = resolveLayout(menu.layout, menu.categories);
  const tieneContenido = menu.categories.length > 0;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Background />
      <AnimatedBackground />

      {/* Fotografia: vive fuera del contenedor con padding para poder
          sobresalir del borde izquierdo e inferior de la pantalla. */}
      <div
        className="pointer-events-none absolute z-20"
        style={{
          left: -RITMO.fotoDesbordeIzquierdo,
          bottom: -RITMO.fotoDesbordeInferior,
        }}
      >
        <FloatingImage photo={menu.photo} size={RITMO.fotoTamano} />
      </div>

      <div
        className="relative z-10 flex h-full flex-col"
        style={{
          paddingTop: RITMO.paddingTop,
          paddingLeft: RITMO.paddingX,
          paddingRight: RITMO.paddingX,
          paddingBottom: RITMO.paddingBottom,
        }}
      >
        <Header subtitle={subtitle} />

        <div style={{ marginTop: RITMO.gapHeaderTitulo }}>
          <MenuTitle
            title={menu.title}
            section={menu.section}
            tagline={menu.tagline}
          />
        </div>

        <div
          className="min-h-0 flex-1"
          style={{ marginTop: RITMO.gapTituloContenido }}
        >
          <FitContent>
            {tieneContenido ? (
              <Tarjetas menu={menu} layout={layout} />
            ) : (
              <Pendiente />
            )}
          </FitContent>
        </div>

        <div
          className="relative shrink-0"
          style={{ height: RITMO.bandaInferior }}
        >
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              // Deja libre el ancho visible de la fotografia. Se pega a su
              // borde: a la altura del pie la foto ya se estrecha, asi que no
              // hace falta mas holgura y se gana sitio para las pastillas.
              paddingLeft:
                RITMO.fotoTamano -
                RITMO.fotoDesbordeIzquierdo -
                RITMO.paddingX +
                16,
            }}
          >
            <Footer
              footnote={menu.footnote}
              extras={menu.extras}
              playlist={playlist}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Estado de un menu que aun no tiene datos cargados. */
function Pendiente() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="vidrio brillo-superior mx-auto flex max-w-[620px] flex-col items-center rounded-[48px] px-16 py-14 text-center"
      style={{ boxShadow: "var(--shadow-tarjeta)" }}
    >
      <span className="font-[family-name:var(--font-display)] text-[46px] font-semibold text-tinta">
        Muy pronto
      </span>
      <span className="mt-3 text-[26px] font-light text-tinta-suave">
        Pregunta en mostrador por nuestras opciones
      </span>
    </motion.div>
  );
}

/**
 * Distribucion de las tarjetas de categoria.
 *
 * `feature` reserva una tarjeta ancha arriba y reparte el resto debajo; las
 * demas distribuciones son una sola fila de 1, 2 o 3 tarjetas iguales.
 */
function Tarjetas({
  menu,
  layout,
}: {
  menu: MenuScreenData;
  layout: MenuLayout;
}) {
  const variantes = contenedor(0.2, 0.55);

  /**
   * Cabecera apilada (precio arriba, centrado) cuando la tarjeta es estrecha:
   * siempre con tres por fila, y tambien con dos si el precio lleva varios
   * tamanos, porque el grupo de pastillas se comeria el ancho del titulo.
   */
  const usarCabeceraApilada = (
    tarjetasFila: number,
    categories: MenuCategory[],
  ) =>
    tarjetasFila >= 3 ||
    (tarjetasFila >= 2 &&
      categories.some((category) => toPriceTiers(category.price).length > 1));

  if (layout === "feature" && menu.categories.length > 1) {
    const [principal, ...secundarias] = menu.categories;
    const tarjetasFila = cardsPerRow("feature", menu.categories.length);
    const columnasSecundaria = (category: MenuCategory) =>
      columnsOfCategory("side", tarjetasFila, category);
    // Las tarjetas de abajo comparten tipografia para verse como un conjunto.
    const fuenteSecundarias = sharedFontSize(
      "side",
      tarjetasFila,
      secundarias,
      columnasSecundaria,
    );
    const columnasPrincipal = columnsOfCategory("hero", 1, principal);

    return (
      <motion.div
        variants={variantes}
        initial="oculto"
        animate="visible"
        className="flex flex-col gap-8"
      >
        <CategoryCard
          category={principal}
          emphasis="hero"
          columns={columnasPrincipal}
          fontSize={fontSizeFor("hero", 1, principal.items, columnasPrincipal)}
        />

        <div
          className="grid items-stretch gap-7"
          style={{
            gridTemplateColumns: `repeat(${tarjetasFila}, minmax(0, 1fr))`,
          }}
        >
          {secundarias.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              className="h-full"
              compact={usarCabeceraApilada(tarjetasFila, secundarias)}
              reserveHeader={tarjetasFila > 1}
              columns={columnasSecundaria(category)}
              fontSize={fuenteSecundarias}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // Fila unica: solo / duo / trio.
  const tarjetasFila = Math.max(
    1,
    Math.min(cardsPerRow(layout, menu.categories.length), menu.categories.length),
  );
  const esUnica = tarjetasFila === 1;
  const role = esUnica ? "hero" : "equal";
  const columnasDe = (category: MenuCategory) =>
    columnsOfCategory(role, tarjetasFila, category);
  const fuente = sharedFontSize(role, tarjetasFila, menu.categories, columnasDe);

  return (
    <motion.div
      variants={variantes}
      initial="oculto"
      animate="visible"
      className="grid items-stretch gap-7"
      style={{ gridTemplateColumns: `repeat(${tarjetasFila}, minmax(0, 1fr))` }}
    >
      {menu.categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          className="h-full"
          emphasis={esUnica ? "hero" : "normal"}
          compact={usarCabeceraApilada(tarjetasFila, menu.categories)}
          reserveHeader={tarjetasFila > 1}
          columns={columnasDe(category)}
          fontSize={fuente}
        />
      ))}
    </motion.div>
  );
}
