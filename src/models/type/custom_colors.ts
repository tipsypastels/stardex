import { ReactiveMap } from "@solid-primitives/map";
import { createEffect, createRoot } from "solid-js";
import * as v from "valibot";
import { stored } from "../../utils/storage";

export type RawCustomTypeColors = v.InferOutput<typeof RawCustomTypeColors>;
export const RawCustomTypeColors = v.record(v.string(), v.string());

export const customTypeColors = createRoot(() => {
  const store = stored("stardex_custom_type_colors");
  const all = new ReactiveMap<string, string>();

  let caught = false;

  try {
    const raw = store.load();
    if (raw) setFromRaw(v.parse(RawCustomTypeColors, raw));
  } catch (error) {
    // Custom type colours are an extremely tertiary feature - if
    // they're corrupted somehow, do nothing instead of saying the
    // whole project is corrupt.
    // eslint-disable-next-line no-console
    console.warn("Invalid custom type colors:", error);
    caught = true;
  }
  if (!caught) {
    createEffect(() => store.dump(toRaw()));
  }

  function toRaw(): RawCustomTypeColors {
    return Object.fromEntries(all.entries());
  }

  function setFromRaw(raw: RawCustomTypeColors) {
    for (const [key, color] of Object.entries(raw)) {
      all.set(key, color);
    }
  }

  return {
    get(key: string) {
      return all.get(key);
    },
    set(key: string, color: string) {
      all.set(key, color);
    },
    delete(key: string) {
      all.delete(key);
    },
    toRaw,
    setFromRaw,
  };
});
