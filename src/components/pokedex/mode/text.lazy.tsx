import { lazy, Suspense } from "solid-js";
import { Empty } from "../../common/empty";
import { Icon } from "../../common/icon";

const Text = lazy(() => import("./text").then((mod) => ({ default: mod.PokedexTextView })));

export function PokedexTextViewLazy() {
  return (
    <Suspense
      fallback={
        <Empty>
          <Icon name="spinner" class="fa-spin" />
        </Empty>
      }
    >
      <Text />
    </Suspense>
  );
}
