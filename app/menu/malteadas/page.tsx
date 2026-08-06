import type { Metadata } from "next";

import { MenuScreen } from "@/components/MenuScreen";
import { ScreenFrame } from "@/components/ScreenFrame";
import { site } from "@/config/site";
import { malteadas } from "@/data/malteadas";

export const metadata: Metadata = {
  title: `${malteadas.label} · ${site.brand}`,
};

export default function MalteadasPage() {
  return (
    <ScreenFrame>
      <MenuScreen menu={malteadas.screens[0]} />
    </ScreenFrame>
  );
}
