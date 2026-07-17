import { batch, useSignal, type ReadonlySignal } from "@preact/signals";
import { useContext, type FunctionComponent } from "preact/compat";
import { PokedexFilter, type PokedexFilteredEntry } from "../../../models/pokedex/filter";
import type { PokedexModeKey } from "../../../models/pokedex/mode";
import type { AutosortRequest } from "../../../models/pokemon/autosort";
import type { PokemonList } from "../../../models/pokemon/list";
import { PokedexModeContext } from "../../../state/context";
import { toasts } from "../../../state/toast";
import { PokedexActions } from "../actions";
import { toastDescriptionOfAutosortRequest } from "../actions/autosort";
import { PokedexIconsView } from "./icons";
import { PokedexNamesView } from "./names";
import { PokedexTextView } from "./text";

interface ModeRenderingInfo {
  component: FunctionComponent<PokedexModeViewProps>;
}

const MODE_INFOS: Record<PokedexModeKey, ModeRenderingInfo> = {
  icons: {
    component: PokedexIconsView,
  },
  names: {
    component: PokedexNamesView,
  },
  text: {
    component: PokedexTextView,
  },
};

export interface PokedexModeViewProps {
  filter: PokedexFilter;
  zapper: ReadonlySignal<boolean>;
  pokemons: PokemonList;
  filtered: ReadonlySignal<PokedexFilteredEntry[]>;
  setEditingIndex(index: number): void;
}

export interface PokedexModeProps {
  filter: PokedexFilter;
  pokemons: PokemonList;
  filtered: ReadonlySignal<PokedexFilteredEntry[]>;
  setEditingIndex(index: number): void;
}

export function PokedexMode({ filter, pokemons, filtered, setEditingIndex }: PokedexModeProps) {
  const format = useContext(PokedexModeContext);
  const formatInfo = MODE_INFOS[format.key.value];
  const Component = formatInfo.component;

  const zapper = useSignal(false);

  function onAutosort(request: AutosortRequest) {
    batch(() => {
      filter.state.value = undefined;
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
        pokemons={pokemons}
        filter={filter}
        mode={format}
        zapper={zapper}
        onAutosort={onAutosort}
      />
      <Component
        filter={filter}
        zapper={zapper}
        pokemons={pokemons}
        filtered={filtered}
        setEditingIndex={setEditingIndex}
      />
    </>
  );
}
