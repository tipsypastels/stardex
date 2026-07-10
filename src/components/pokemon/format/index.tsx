import { useModel } from "@preact/signals";
import { useContext, useRef, type FunctionComponent } from "preact/compat";
import { PokedexFilter } from "../../../models/pokedex/filter";
import type { PokedexFormatKey } from "../../../models/pokedex/format";
import { PokedexFormatContext } from "../../../state/context";
import { PokedexActions } from "../actions";
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
  setEditingIndex(index: number): void;
}

export interface PokedexFormatProps {
  setEditingIndex(index: number): void;
}

export function PokedexFormat({ setEditingIndex }: PokedexFormatProps) {
  const format = useContext(PokedexFormatContext);
  const filter = useModel(PokedexFilter);

  const formatInfo = FORMAT_INFOS[format.key.value];
  const Component = formatInfo.component;

  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <PokedexActions filter={filter} inTextView={format.key.value === "text"} />
      <div class="mb-4" ref={ref}>
        <Component filter={filter} setEditingIndex={setEditingIndex} />
      </div>
    </>
  );
}
