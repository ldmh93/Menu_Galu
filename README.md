# GALU · Menú digital

Pantalla de señalización digital para GALU (Bobas, Frozen Yogurt, Ice Rollers,
Malteadas y Especialidades). Next.js 15 (App Router) + TypeScript + TailwindCSS 4
+ Framer Motion + Lucide.

Diseñada sobre un lienzo fijo de **1080 × 1920 (9:16)** que se escala solo a
cualquier pantalla vertical.

---

## Arrancar

```bash
npm install
npm run dev        # http://localhost:3000
```

Producción:

```bash
npm run build
npm start
```

## URLs

| URL | Qué muestra |
| --- | --- |
| `/` | **La que va en la TV.** Reproduce todos los menús en bucle |
| `/menu/ice-rollers` | Solo Ice Rollers (1 pantalla) |
| `/menu/bobas` | Solo Bobas (sus 5 pantallas en bucle) |
| `/menu/frozen-yogurt` | Solo Frozen Yogurt |
| `/menu/sodas-italianas` | Solo Sodas Italianas |
| `/menu/blizz` | Solo Blizz |
| `/menu/malteadas` | Pendiente de datos |
| `/menu/especialidades` | Pendiente de datos |

Ciclo actual en `/`: **9 pantallas** (Ice Rollers 1 + Bobas 5 + Frozen Yogurt 1
+ Sodas Italianas 1 + Blizz 1) ≈ 108 segundos.

### Controles durante la instalación

| Acción | Efecto |
| --- | --- |
| `?autoplay=off` | Arranca en pausa (ej. `http://localhost:3000/?autoplay=off`) |
| `→` / `←` | Pantalla siguiente / anterior |
| Barra espaciadora | Pausar / reanudar |

El cursor se oculta solo tras 4 segundos sin movimiento.

---

## Editar el menú

**Todo el contenido vive en `/data`. Nunca se escriben productos dentro de un
componente.**

```
data/
  iceRollers.ts      ← datos reales (1 pantalla)
  bobas.ts           ← datos reales (5 pantallas)
  frozenYogurt.ts    ← datos reales (1 pantalla)
  sodasItalianas.ts  ← datos reales (1 pantalla)
  blizz.ts           ← datos reales (1 pantalla)
  malteadas.ts       ← PENDIENTE, sin productos
  especialidades.ts  ← PENDIENTE, sin productos
  types.ts           ← el "esquema" de los datos
  menus.ts           ← registro y orden de reproducción
```

Cada archivo exporta un **grupo** (`MenuGroup`): un menú puede ocupar una
pantalla o varias. Bobas usa cinco porque son 64 sabores base + 72
combinaciones; todas llevan el mismo título "Bobas" y se distinguen por la
pastilla de sección (`section`).

Un producto puede ser texto plano o un objeto:

```ts
items: [
  "Arándanos",                                        // simple
  { name: "Fresa", note: "$79" },                     // excepción de precio
  { name: "Chocolate Dubái", tag: "nuevo" },          // insignia
  { name: "Yakult", tag: "favorito" },
  { name: "Banana Split",                             // con ingredientes
    description: "Plátano · Hershey's · Nieve de Vainilla" },
]
```

El precio puede ser único, por tamaños, o vivir en cada producto:

```ts
price: 60                                             // una sola pastilla
price: [{ label: "16 oz", value: 72 },                // dos pastillas
        { label: "24 oz", value: 89 }]

// Sin `price` de categoría: cada renglón lleva el suyo, alineado a la derecha.
// Es lo que usa Frozen Yogurt, donde se cobra por tamaño y no por sabor.
items: [{ name: "Cono", description: "1 topping · sin fruta", price: 35 }]
```

Y se puede forzar el número de columnas de una lista cuando conviene
(`columns: 1` en Frozen Yogurt para que se lea como tarifa):

```ts
{ id: "tamanos", name: "Tamaños", columns: 1, items: [...] }
```

Los extras van al pie de la pantalla como pastillas:

```ts
extras: [{ name: "Leche vegetal", price: 10 }, { name: "Tapioca", price: 15 }]
```

Los acentos disponibles (`accent`) son los colores del fondo oficial:
`rosa`, `lavanda`, `menta`, `amarillo`, `morado`.

### Ajustes globales

`config/site.ts` — subtítulo del header, segundos por pantalla, orden de
reproducción, redes sociales. No hay que tocar código para cambiarlos.

---

## Fotografías de producto

Coloca los archivos en `public/productos/` con estos nombres:

```
ice-rollers.png
bobas.png
frozen-yogurt.png
malteadas.png
especialidades.png
```

- **PNG con fondo transparente**, ~1200 px de lado.
- Mientras el archivo no exista se muestra un marcador elegante en su lugar; la
  pantalla nunca se rompe.
- La ruta se declara en el campo `photo.src` de cada archivo de datos.

### Logo

`public/logo.png` mide **266 × 108 px**. Se muestra a 330 px de ancho, así que
se ve ligeramente suavizado. Para nitidez perfecta en un televisor 4K conviene
sustituirlo por el **SVG original** o un PNG de al menos 1000 px de ancho
(mismo nombre y proporción).

---

## Cómo está construido

```
app/
  layout.tsx            fuentes (Fredoka + Poppins) y metadatos
  page.tsx              reproductor en bucle → es la URL de la TV
  menu/<slug>/page.tsx  vista fija de un solo menú
components/
  ScreenFrame.tsx       lienzo 1080×1920 escalado al viewport + modo kiosco
  MenuAutoplay.tsx      temporizador, fundido cruzado y controles de teclado
  MenuScreen.tsx        composición de una pantalla (única fuente del layout)
  FitContent.tsx        ajuste automático de densidad
  Header / Logo / MenuTitle / CategoryCard / ProductList
  FloatingImage / Footer / PlaylistProgress
  Background / AnimatedBackground
lib/
  layout.ts             columnas y tamaño de letra calculados
  accents.ts            colores de marca por acento
  motion.ts             lenguaje de animación
  format.ts             precios y utilidades
styles/globals.css      tokens de diseño (paleta, sombras, cristal)
```

### Decisiones que conviene conocer

**Lienzo fijo escalado.** Todo se compone en píxeles reales de 1080 × 1920 y se
escala con `transform`. La pantalla se ve idéntica en un monitor vertical 1080p,
en un 4K o en el navegador: sin reflow ni breakpoints que rompan la composición.

**Cuatro distribuciones.** `solo` (una tarjeta a todo lo ancho), `duo`, `trio` y
`feature` (una tarjeta principal ancha arriba y el resto debajo). Se elige sola
según cuántas categorías haya y cómo estén de equilibradas — Ice Rollers tiene
21 · 11 · 8, así que usa `feature` porque tres columnas iguales obligarían a
letra pequeña. Se puede forzar con el campo `layout` del menú.

**Tipografía calculada, no adivinada.** `lib/layout.ts` decide cuántas columnas
lleva cada lista y con qué tamaño de letra, a partir del ancho real de la
tarjeta y de la longitud de los nombres. Las tarjetas vecinas comparten tamaño y
reservan la misma altura de cabecera, para que todas las listas arranquen a la
misma altura aunque un título ocupe dos líneas. Y una lista corta usa letra más
grande que una de cuarenta sabores: si sobra sitio, se aprovecha.

Con **una** columna se admite que el nombre más largo se parta en dos (la
sangría francesa lo resuelve). Con **varias**, la letra se calcula para que
ninguno se parta: en una rejilla, un nombre partido estira toda la fila y deja
huecos en las demás columnas.

**Cabecera de precio adaptativa.** Con un solo importe va a la derecha del
título; con varios tamaños (16 oz / 24 oz) el grupo de pastillas necesita
demasiado ancho, así que en tarjetas estrechas se sube y se centra sobre el
nombre, como una medalla.

**Ajuste de densidad.** `FitContent` mide el bloque de tarjetas y lo reduce solo
lo necesario si un menú crece mucho. Nunca se corta un producto. No amplía por
encima del 100 % a propósito: hacerlo estrecharía las columnas.

**Rendimiento.** Las 6 rutas son estáticas (~155 kB de JS). El fondo es un SVG
(nítido a cualquier resolución), las fotos usan `next/image` con lazy loading y
formatos AVIF/WebP, y el autoplay no navega entre rutas: mantiene las pantallas
en memoria para que no haya parpadeos ni recargas.

**Accesibilidad y consumo.** Se respeta `prefers-reduced-motion`: con esa opción
activada se detienen los bucles de flotación y de fondo.

---

## Preparado para el panel administrativo

Los archivos de `/data` implementan los tipos de `data/types.ts`. Cuando exista
el panel, basta con:

1. Convertir `getGroup()` y `getPlaylistScreens()` de `data/menus.ts` en
   funciones `async` que consulten la base de datos.
2. Hacer lo mismo con `site` de `config/site.ts`.

Ningún componente cambia: todos reciben los datos por props y ninguno conoce el
origen.
