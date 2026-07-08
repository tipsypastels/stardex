import { signal, useSignalEffect } from "@preact/signals";
import { stored } from "../utils/storage";

const store = stored<boolean>("stardex_dark");

export const dark = signal(store.load() ?? false);

export function useDarkClass() {
  useSignalEffect(() => {
    store.dump(dark.value);

    if (dark.value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });
}
