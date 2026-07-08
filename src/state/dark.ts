import { signal, useSignalEffect } from "@preact/signals";
import { stored } from "../utils/storage";

const store = stored<boolean>("stardex_dark");
const favicon = document.getElementById("favicon") as HTMLLinkElement;

export const dark = signal(store.load() ?? false);

export function useDarkClass() {
  useSignalEffect(() => {
    store.dump(dark.value);

    if (dark.value) {
      document.documentElement.classList.add("dark");
      favicon.href = "favicon_dark.png";
    } else {
      document.documentElement.classList.remove("dark");
      favicon.href = "favicon.png";
    }
  });
}
