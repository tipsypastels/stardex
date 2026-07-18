import { createEffect, createSignal } from "solid-js";
import { stored } from "../utils/storage";

export const dark = (() => {
  const favicon = document.getElementById("favicon") as HTMLLinkElement;
  const store = stored("stardex_dark");

  const [on, setOn] = createSignal(store.load() === true);

  return {
    get on() {
      return on();
    },
    set on(on: boolean) {
      setOn(on);
    },
    subscribe() {
      createEffect(() => {
        store.dump(on());

        if (on()) {
          document.documentElement.classList.add("dark");
          favicon.href = "favicon_dark.png";
        } else {
          document.documentElement.classList.remove("dark");
          favicon.href = "favicon.png";
        }
      });
    },
  };
})();
