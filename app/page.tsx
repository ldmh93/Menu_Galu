import { MenuAutoplay } from "@/components/MenuAutoplay";
import { ScreenFrame } from "@/components/ScreenFrame";
import { getPlaylistLabels, getPlaylistScreens } from "@/data/menus";

/**
 * Pantalla principal del local: reproduce todos los menus en bucle.
 * Es la URL que hay que abrir en el reproductor / TV.
 */
export default function Home() {
  return (
    <ScreenFrame>
      <MenuAutoplay
        menus={getPlaylistScreens()}
        labels={getPlaylistLabels()}
      />
    </ScreenFrame>
  );
}
