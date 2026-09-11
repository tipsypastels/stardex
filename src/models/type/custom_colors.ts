import { ReactiveMap } from "@solid-primitives/map";
import { createEffect, createRoot } from "solid-js";
import * as v from "valibot";
import { stored } from "../../utils/storage";

export type RawCustomTypeColors = v.InferOutput<typeof RawCustomTypeColors>;
export const RawCustomTypeColors = v.record(v.string(), v.string());

export const customTypeColors = createRoot(() => {
  const all = new ReactiveMap<string, string>();

  try {
    const store = stored("stardex_custom_type_colors");
    const raw_ = store.load();
    if (raw_) {
      const raw = v.parse(RawCustomTypeColors, raw_);
      setFromRaw(raw);
      createEffect(() => store.dump(toRaw()));
    }
  } catch (error) {
    // Custom types are an extremely tertiary feature - if they're corrupted somehow,
    // do nothing instead of saying the whole project is corrupt.
    // eslint-disable-next-line no-console
    console.warn("Invalid custom type colors:", error);
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
