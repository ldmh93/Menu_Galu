import type { Metadata } from "next";

import { MenuScreen } from "@/components/MenuScreen";
import { ScreenFrame } from "@/components/ScreenFrame";
import { site } from "@/config/site";
import { sodasItalianas } from "@/data/sodasItalianas";

export const metadata: Metadata = {
  title: `${sodasItalianas.label} · ${site.brand}`,
};

export default function SodasItalianasPage() {
  return (
    <ScreenFrame>
      <MenuScreen menu={sodasItalianas.screens[0]} />
    </ScreenFrame>
  );
}
