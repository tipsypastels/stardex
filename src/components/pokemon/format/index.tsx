import type { ComponentChildren } from "preact";
import { useContext, useRef, type FunctionComponent } from "preact/compat";
import type { PokedexFilter } from "../../../models/pokedex_filter";
import type { PokedexFormatKey } from "../../../models/pokedex_format";
import { PokedexFormatContext } from "../../../state/context";
import { PokedexIconsView } from "./icons";
import { PokedexNamesView } from "./names";

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
    component: () => null,
  },
};

export interface PokedexFormatViewProps {
  filter: PokedexFilter;
  setEditingIndex(index: number): void;
}

export interface PokedexFormatProps extends PokedexFormatViewProps {
  actions(): ComponentChildren;
}

export function PokedexFormat({ actions, ...rest }: PokedexFormatProps) {
  const format = useContext(PokedexFormatContext);
  const formatInfo = FORMAT_INFOS[format.key.value];
  const Component = formatInfo.component;

  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      {actions()}
      <div class="mb-4" ref={ref}>
        <Component {...rest} />
      </div>
    </>
  );
}
