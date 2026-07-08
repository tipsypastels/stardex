import { createModel, signal } from "@preact/signals";
import type { Pokemon } from "./pokemon";

type Inner = { kind: "type"; typeKey: string } | undefined;

export const PokedexFilter = createModel(() => {
  const inner = signal<Inner>();
  const supressed = signal(false);

  return {
    supressed,
    permits(pokemon: Pokemon) {
      if (!inner.value) {
        return true;
      }
      switch (inner.value.kind) {
        case "type": {
          return pokemon.typeKeys.value.includes(inner.value.typeKey);
        }
      }
    },
    setFromParsed(s: string) {
      const [key, value] = s.split("=");
      if (!key || !value) {
        inner.value = undefined;
        return;
      }
      switch (key) {
        case "type": {
          inner.value = { kind: "type", typeKey: value };
          break;
        }
        default: {
          inner.value = undefined;
        }
      }
    },
  };
});
