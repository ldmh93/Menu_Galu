import type { Metadata } from "next";

import { MenuAutoplay } from "@/components/MenuAutoplay";
import { ScreenFrame } from "@/components/ScreenFrame";
import { site } from "@/config/site";
import { bobas } from "@/data/bobas";

export const metadata: Metadata = {
  title: `${bobas.label} · ${site.brand}`,
};

/** Bobas ocupa cinco pantallas: la ruta las reproduce en bucle. */
export default function BobasPage() {
  return (
    <ScreenFrame>
      <MenuAutoplay
        menus={bobas.screens}
        labels={bobas.screens.map((screen) => screen.title)}
      />
    </ScreenFrame>
  );
}
