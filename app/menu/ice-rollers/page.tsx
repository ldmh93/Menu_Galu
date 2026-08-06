import type { Metadata } from "next";

import { MenuScreen } from "@/components/MenuScreen";
import { ScreenFrame } from "@/components/ScreenFrame";
import { site } from "@/config/site";
import { iceRollers } from "@/data/iceRollers";

export const metadata: Metadata = {
  title: `${iceRollers.label} · ${site.brand}`,
};

/** Vista fija de un solo menu (util para revisar). */
export default function IceRollersPage() {
  return (
    <ScreenFrame>
      <MenuScreen menu={iceRollers.screens[0]} />
    </ScreenFrame>
  );
}
