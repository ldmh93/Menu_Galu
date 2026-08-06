import type { Metadata } from "next";

import { MenuScreen } from "@/components/MenuScreen";
import { ScreenFrame } from "@/components/ScreenFrame";
import { site } from "@/config/site";
import { frozenYogurt } from "@/data/frozenYogurt";

export const metadata: Metadata = {
  title: `${frozenYogurt.label} · ${site.brand}`,
};

export default function FrozenYogurtPage() {
  return (
    <ScreenFrame>
      <MenuScreen menu={frozenYogurt.screens[0]} />
    </ScreenFrame>
  );
}
