import { lazy, Suspense } from "solid-js";
import type { PokedexModeViewProps } from ".";
import { Empty } from "../../common/empty";
import { Icon } from "../../common/icon";

const Text = lazy(() => import("./text").then((mod) => ({ default: mod.PokedexTextView })));

export function PokedexTextViewLazy(props: PokedexModeViewProps) {
  return (
    <Suspense
      fallback={
        <Empty class="rounded-t-none border-t-0">
          <Icon name="spinner" class="fa-spin" />
        </Empty>
      }
    >
      <Text {...props} />
    </Suspense>
  );
}
