import type { Metadata } from "next";

import { MenuScreen } from "@/components/MenuScreen";
import { ScreenFrame } from "@/components/ScreenFrame";
import { site } from "@/config/site";
import { especialidades } from "@/data/especialidades";

export const metadata: Metadata = {
  title: `${especialidades.label} · ${site.brand}`,
};

export default function EspecialidadesPage() {
  return (
    <ScreenFrame>
      <MenuScreen menu={especialidades.screens[0]} />
    </ScreenFrame>
  );
}
