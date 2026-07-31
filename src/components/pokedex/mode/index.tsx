import { batch, createSignal, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { pokedexFilter } from "../../../models/pokedex/filter";
import { pokedexMode, type PokedexModeKey } from "../../../models/pokedex/mode";
import type { AutosortRequest } from "../../../models/pokemon/autosort";
import { pokemons } from "../../../models/pokemon/list";
import { toasts } from "../../../models/ui/toast";
import { PokedexActions } from "../actions";
import { toastDescriptionOfAutosortRequest } from "../actions/autosort";
import { PokedexEmpty } from "../empty";
import { PokedexIconsView } from "./icons";
import { PokedexNamesView } from "./names";
import { PokedexTextViewLazy } from "./text.lazy";

interface ModeRenderingInfo {
  component: Component<PokedexModeViewProps>;
}

const MODE_INFOS: Record<PokedexModeKey, ModeRenderingInfo> = {
  icons: {
    component: PokedexIconsView,
  },
  names: {
    component: PokedexNamesView,
  },
  text: {
    component: PokedexTextViewLazy,
  },
};

export interface PokedexModeProps {
  setEditingId(id: string): void;
}

export interface PokedexModeViewProps extends PokedexModeProps {
  zapper: boolean;
  setAfterActionChange(f: (() => void) | undefined): void;
}

export function PokedexMode(props: PokedexModeProps) {
  const formatInfo = () => MODE_INFOS[pokedexMode.key];
  const [zapper, setZapper] = createSignal(false);

  let afterActionChange: (() => void) | undefined;

  function onAutosort(request: AutosortRequest) {
    batch(() => {
      pokedexFilter.state = undefined;
      pokemons.autosort(request);
      toasts.add(
        "arrow-down-1-9",
        `Pokédex sorted by ${toastDescriptionOfAutosortRequest(request)}!`,
      );
    });
  }

  return (
    <>
      <PokedexActions
        zapper={zapper()}
        setZapper={setZapper}
        onAutosort={onAutosort}
        afterActionChange={() => afterActionChange?.()}
      />
      <Dynamic
        component={formatInfo().component}
        zapper={zapper()}
        setEditingId={props.setEditingId}
        setAfterActionChange={(f) => (afterActionChange = f)}
      />
      <PokedexEmpty afterActionChange={() => afterActionChange?.()} />
    </>
  );
}
