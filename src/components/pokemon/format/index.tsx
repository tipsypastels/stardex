import { useModel } from "@preact/signals";
import { useContext, useRef, type FunctionComponent, type RefObject } from "preact/compat";
import { PokedexFilter } from "../../../models/pokedex/filter";
import type { PokedexFormatKey } from "../../../models/pokedex/format";
import { PokedexFormatContext, PokemonsContext } from "../../../state/context";
import { PokedexActions } from "../actions";
import { PokedexIconsView } from "./icons";
import { PokedexNamesView } from "./names";
import { PokedexTextView } from "./text";
import { useDraggable } from "./util/drag";

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
  gridRef: RefObject<HTMLOListElement>;
  filter: PokedexFilter;
  setEditingIndex(index: number): void;
}

export interface PokedexFormatProps {
  setEditingIndex(index: number): void;
}

export function PokedexFormat({ setEditingIndex }: PokedexFormatProps) {
  const pokemons = useContext(PokemonsContext);
  const format = useContext(PokedexFormatContext);
  const filter = useModel(PokedexFilter);

  const formatInfo = FORMAT_INFOS[format.key.value];
  const Component = formatInfo.component;

  const ref = useRef<HTMLDivElement>(null);
  const draggable = useDraggable(format.key.value, pokemons);

  return (
    <>
      <PokedexActions
        filter={filter}
        inTextView={format.key.value === "text"}
        onAutosort={(options) => {
          filter.raw.value = undefined;

          const { keys, apply } = pokemons.autosorter(options);
          draggable.sort(keys);
          // Give the animation time to finish without
          // interrupting it with re-renders.
          setTimeout(apply, 100);
        }}
      />
      <div class="mb-4" ref={ref}>
        <Component gridRef={draggable.gridRef} filter={filter} setEditingIndex={setEditingIndex} />
      </div>
    </>
  );
}
