import { createStore } from "solid-js/store";
import { id } from "../utils/id";

export interface Toast {
  id: string;
  icon: string;
  text: string;
}

export const toasts = (() => {
  const [all, setAll] = createStore<Toast[]>([]);

  return {
    get current() {
      return all[0];
    },
    add(icon: string, text: string) {
      setAll(all.length, { id: id(), icon, text });
    },
    next() {
      setAll((all) => all.slice(1));
    },
  };
})();
