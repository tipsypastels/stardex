import { derived, writable } from "svelte/store";
import { resolvePokemon, type Pokemon } from "./models/pokemon";

export type ResolvedPokemon =
  | { type: "pokemon"; pokemon: Pokemon }
  | { type: "not-found"; key: string };

export interface State {
  pokemon: (string | Pokemon)[];
}

const state = writable<State>({ pokemon: ["bulbasaur", "foo"] });

export const rawPokemon = derived(state, (s) => s.pokemon);
export const resolvedPokemon = derived(rawPokemon, (rawPokemon) =>
  rawPokemon.map((rawMon): ResolvedPokemon => {
    if (typeof rawMon === "string") {
      const resolvedMon = resolvePokemon(rawMon);
      if (resolvedMon) {
        return { type: "pokemon", pokemon: resolvedMon };
      } else {
        return { type: "not-found", key: rawMon };
      }
    }
    return { type: "pokemon", pokemon: rawMon };
  }),
);
