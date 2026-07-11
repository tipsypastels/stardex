import { batch, type ReadonlySignal } from "@preact/signals";
import { useContext, type FunctionComponent } from "preact/compat";
import { PokedexFilter } from "../../../models/pokedex/filter";
import type { PokedexFormatKey } from "../../../models/pokedex/format";
import type { Pokemon } from "../../../models/pokemon";
import type { AutosortRequest } from "../../../models/pokemon/autosort";
import type { PokemonList } from "../../../models/pokemon/list";
import { PokedexFormatContext } from "../../../state/context";
import { toasts } from "../../../state/toast";
import { PokedexActions } from "../actions";
import { toastDescriptionOfAutosortRequest } from "../actions/autosort";
import { PokedexIconsView } from "./icons";
import { PokedexNamesView } from "./names";
import { PokedexTextView } from "./text";

interface FormatRenderingInfo {
  component: FunctionComponent<PokedexFormatViewProps>;
}

const FORMAT_INFOS: Record<PokedexFormatKey, FormatRenderingInfo> = {
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

export interface PokedexFormatViewProps {
  filter: PokedexFilter;
  pokemons: PokemonList;
  pokemonsFiltered: ReadonlySignal<Pokemon[]>;
  setEditingIndex(index: number): void;
}

export interface PokedexFormatProps {
  filter: PokedexFilter;
  pokemons: PokemonList;
  pokemonsFiltered: ReadonlySignal<Pokemon[]>;
  setEditingIndex(index: number): void;
}

export function PokedexFormat({
  filter,
  pokemons,
  pokemonsFiltered,
  setEditingIndex,
}: PokedexFormatProps) {
  const format = useContext(PokedexFormatContext);
  const formatInfo = FORMAT_INFOS[format.key.value];
  const Component = formatInfo.component;

  function onAutosort(request: AutosortRequest) {
    batch(() => {
      filter.state.value = undefined;
      pokemons.autosort(request);
      toasts.push({
        text: `Pokédex sorted by ${toastDescriptionOfAutosortRequest(request)}!`,
        icon: "arrow-down-1-9",
      });
    });
  }

  return (
    <>
      <PokedexActions
        filter={filter}
        inTextView={format.key.value === "text"}
        onAutosort={onAutosort}
      />
      <div class="mb-4">
        <Component
          filter={filter}
          pokemons={pokemons}
          pokemonsFiltered={pokemonsFiltered}
          setEditingIndex={setEditingIndex}
        />
      </div>
    </>
  );
}
