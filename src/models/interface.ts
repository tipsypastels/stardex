import { createEffect, createRoot, createSignal } from "solid-js";
import * as v from "valibot";
import { stored } from "../utils/storage";

export type GlobalInterfaceOptions = v.InferOutput<typeof GlobalInterfaceOptions>;
export const GlobalInterfaceOptions = v.object({
  pipRecommendations: v.optional(v.boolean()),
});

export const globalInterfaceOptions = createRoot(() => {
  const store = stored("stardex_global_interface_options");
  const [value, setValue] = createSignal<GlobalInterfaceOptions>({});

  let caught = false;

  try {
    const raw = store.load();
    if (raw) setValue(v.parse(GlobalInterfaceOptions, raw));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Invalid global interface options:", error);
    caught = true;
  }

  if (!caught) {
    createEffect(() => store.dump(value()));
  }

  return {
    get pipRecommendations() {
      return value()?.pipRecommendations ?? false;
    },

    set pipRecommendations(pipRecommendations) {
      setValue((value) => ({ ...value, pipRecommendations }));
    },
  };
});
