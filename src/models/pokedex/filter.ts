import { computed, createModel, signal } from "@preact/signals";
import type { Pokemon } from "../pokemon";
import { TYPES } from "../type";

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

  const iterator = computed(() => {
    parsed.value;
    return (pokemons: Iterable<Pokemon>) => new FilteredPokemonList(parsed.value, pokemons);
  });

  return { raw, supressed, icon, ofKind, iterator };
});

class FilteredPokemonList {
  static permitted(parsed: Parsed | undefined, pokemon: Pokemon) {
    if (!parsed) {
      return true;
    }
    switch (parsed.kind) {
      case "type": {
        return pokemon.typeKeys.value.includes(parsed.typeKey);
      }
    }
  }

  #first: IteratorResult<Pokemon>;
  #rest: Generator<Pokemon>;

  constructor(parsed: Parsed | undefined, pokemons: Iterable<Pokemon>) {
    this.#rest = (function* () {
      for (const pokemon of pokemons) {
        if (FilteredPokemonList.permitted(parsed, pokemon)) {
          yield pokemon;
        }
      }
    })();
    this.#first = this.#rest.next();
  }

  get isEmpty() {
    return this.#first.done;
  }

  *[Symbol.iterator]() {
    if (!this.#first.done) {
      yield this.#first.value;
      yield* this.#rest;
    }
  }

  toArray() {
    return [...this];
  }
}
