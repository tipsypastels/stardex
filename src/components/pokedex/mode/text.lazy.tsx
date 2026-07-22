import { lazy, Suspense } from "solid-js";
import { Empty } from "../../common/empty";
import { Icon } from "../../common/icon";
import { getTextViewEditorLoadingHeight } from "./text/height";

const Text = lazy(() => import("./text").then((mod) => ({ default: mod.PokedexTextView })));

export function PokedexTextViewLazy() {
  return (
    <Suspense
      fallback={
        <Empty class="border-t-0" height={getTextViewEditorLoadingHeight()}>
          <Icon name="spinner" class="fa-spin" />
        </Empty>
      }
    >
      <Text />
    </Suspense>
  );
}
