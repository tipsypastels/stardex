import { batch, createSignal, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { pokedexFilter, type PokedexFilteredEntry } from "../../../models/pokedex/filter";
import { pokedexMode, type PokedexModeKey } from "../../../models/pokedex/mode";
import type { AutosortRequest } from "../../../models/pokemon/autosort";
import { pokemons } from "../../../models/pokemon/list";
import { PokedexIconsView } from "./icons";

interface ModeRenderingInfo {
  component: Component<PokedexModeViewProps>;
}

const MODE_INFOS: Record<PokedexModeKey, ModeRenderingInfo> = {
  icons: {
    component: PokedexIconsView,
  },
  names: {
    component: () => null,
  },
  text: {
    // TODO: Lazy load.
    component: () => null,
  },
};

export interface PokedexModeProps {
  filtered: PokedexFilteredEntry[];
  setEditingIndex(index: number): void;
}

export interface PokedexModeViewProps extends PokedexModeProps {
  zapper: boolean;
}

export function PokedexMode(props: PokedexModeProps) {
  const formatInfo = () => MODE_INFOS[pokedexMode.key];

  const [zapper, setZapper] = createSignal(false);

  function onAutosort(request: AutosortRequest) {
    batch(() => {
      pokedexFilter.state = undefined;
      pokemons.autosort(request);
      // TODO
      // toasts.add(
      //   "arrow-down-1-9",
      //   `Pokédex sorted by ${toastDescriptionOfAutosortRequest(request)}!`,
      // );
    });
  }

  return (
    <>
      {/* <PokedexActions zapper={zapper} onAutosort={onAutosort} /> */}
      <Dynamic
        component={formatInfo().component}
        zapper={zapper()}
        filtered={props.filtered}
        setEditingIndex={props.setEditingIndex}
      />
    </>
  );
}
