import { computed, createModel, signal } from "@preact/signals";
import type { Pokemon } from "./pokemon";
import { TYPES } from "./type";

type Parsed = { kind: "type"; typeKey: string };

export type PokedexFilter = InstanceType<typeof PokedexFilter>;

export const PokedexFilter = createModel(() => {
  const raw = signal<string>();
  const supressed = signal(false);

  const parsed = computed((): Parsed | undefined => {
    if (!raw.value) {
      return;
    }
    const [kind, value] = raw.value.split(":");
    if (!kind || !value) return;

    switch (kind) {
      case "type": {
        return { kind, typeKey: value };
      }
    }
  });

  const icon = computed(() => {
    if (!parsed.value) {
      return "asterisk";
    }
    switch (parsed.value.kind) {
      case "type": {
        return TYPES.of(parsed.value.typeKey).icon;
      }
    }
  });

  // NOTE: Unsure if this is needed. I still don't understand
  // the rules for when accessors are allowed to read signals.
  const ofKind = computed(() => {
    raw.value;
    return (kind: Parsed["kind"]) => (parsed.value?.kind === kind ? raw.value : undefined);
  });

  const renderPermitted = computed(() => {
    parsed.value;

    function permitted(pokemon: Pokemon) {
      if (!parsed.value) {
        return true;
      }
      switch (parsed.value.kind) {
        case "type": {
          return pokemon.typeKeys.value.includes(parsed.value.typeKey);
        }
      }
    }

    return <T>(pokemons: Iterable<Pokemon>, f: (pokemon: Pokemon) => T, fallback: () => T) => {
      const out: T[] = [];
      for (const pokemon of pokemons) {
        if (permitted(pokemon)) {
          out.push(f(pokemon));
        }
      }
      return out.length > 0 ? out : [fallback()];
    };
  });

  return { raw, supressed, icon, ofKind, renderPermitted };
});
