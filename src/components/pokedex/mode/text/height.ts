import { onCleanup, onMount, type Accessor } from "solid-js";
import { stored } from "../../../../utils/storage";

// NOTE: This isn't project scoped. I consider that to probably
// be fine for a best effort UI thing, but I might change my mind.
const store = stored("stardex_text_editor_latest_height");

export function createCachedHeightTracker(parent: Accessor<HTMLDivElement>) {
  onMount(() => {
    const interval = setInterval(() => {
      if (parent().children.length === 0) {
        return; // editor not yet initialized
      }

      const height = parent().offsetHeight;
      store.dump(height);
    }, 60 * 1000);

    onCleanup(() => clearInterval(interval));
  });
}

export function getTextViewEditorLoadingHeight() {
  const height = store.load();
  if (height && typeof height === "number") return height;
}
