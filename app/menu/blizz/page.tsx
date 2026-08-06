import type { Metadata } from "next";

import { MenuScreen } from "@/components/MenuScreen";
import { ScreenFrame } from "@/components/ScreenFrame";
import { site } from "@/config/site";
import { blizz } from "@/data/blizz";

export const metadata: Metadata = {
  title: `${blizz.label} · ${site.brand}`,
};

export default function BlizzPage() {
  return (
    <ScreenFrame>
      <MenuScreen menu={blizz.screens[0]} />
    </ScreenFrame>
  );
}
