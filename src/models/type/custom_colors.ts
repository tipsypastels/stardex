import { ReactiveMap } from "@solid-primitives/map";
import { createEffect, createRoot } from "solid-js";
import * as v from "valibot";
import { stored } from "../../utils/storage";
import { catchStartupError } from "../ui/error";

export type RawCustomTypeColors = v.InferOutput<typeof RawCustomTypeColors>;
export const RawCustomTypeColors = v.record(v.string(), v.string());

export const customTypeColors = createRoot(() => {
  const store = stored("stardex_custom_type_colors");
  const all = new ReactiveMap<string, string>();
  const caught = catchStartupError("customTypeColors", () => {
    const raw_ = store.load();
    if (!raw_) return;

    const raw = v.parse(RawCustomTypeColors, raw_);
    setFromRaw(raw);
  });

  if (!caught) {
    createEffect(() => {
      store.dump(toRaw());
    });
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
