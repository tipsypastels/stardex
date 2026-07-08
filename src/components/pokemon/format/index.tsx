import type { ComponentChildren } from "preact";
import { lazy, Suspense, useContext, useRef, type FunctionComponent } from "preact/compat";
import type { PokedexFormatKey } from "../../../models/pokedex_format";
import { PokedexFormatContext } from "../../../state/context";
import { PokedexFormatLoading, usePokedexFormatClientHeightSaving } from "./loading";

interface FormatRenderingInfo {
  load: FunctionComponent;
}

const FORMAT_INFOS: Record<PokedexFormatKey, FormatRenderingInfo> = {
  icons: {
    load: lazy(async () => (await import("./icons")).PokedexIconsView),
  },
  names: {
    load: () => null,
  },
  legacyText: {
    load: () => null,
  },
};

export interface PokedexFormatProps {
  actions(): ComponentChildren;
}

export function PokedexFormat({ actions }: PokedexFormatProps) {
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
          <Component />
        </Suspense>
      </div>
    </>
  );
}
