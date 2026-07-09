import type { ComponentChildren } from "preact";
import { lazy, Suspense, useContext, useRef, type FunctionComponent } from "preact/compat";
import type { PokedexFilter } from "../../../models/pokedex_filter";
import type { PokedexFormatKey } from "../../../models/pokedex_format";
import { PokedexFormatContext } from "../../../state/context";
import { PokedexFormatLoading, usePokedexFormatClientHeightSaving } from "./loading";

interface FormatRenderingInfo {
  load: FunctionComponent<PokedexFormatViewProps>;
}

const FORMAT_INFOS: Record<PokedexFormatKey, FormatRenderingInfo> = {
  icons: {
    load: lazy(async () => (await import("./icons")).PokedexIconsView),
  },
  names: {
    load: lazy(async () => (await import("./names")).PokedexNamesView),
  },
  text: {
    load: () => null,
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
  const Component = formatInfo.load;

  const ref = useRef<HTMLDivElement>(null);

  usePokedexFormatClientHeightSaving(ref);

  return (
    <>
      {actions()}
      <div class="mb-4" ref={ref}>
        <Suspense fallback={<PokedexFormatLoading />}>
          <Component {...rest} />
        </Suspense>
      </div>
    </>
  );
}
