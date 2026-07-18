import { batch } from "@preact/signals";
import { createEffect, createMemo, createSignal } from "solid-js";
import { pokedexFilter, runPokedexFilter } from "../../models/pokedex/filter";
import { pokemons } from "../../models/pokemon/list";
import { toasts } from "../../state/toast";
import { Section } from "../layout/section";
import { EditPokemonModal } from "./edit";
import { PokedexMode } from "./mode";

export function Pokedex() {
  const [editingIndex, setEditingIndex] = createSignal<number>();
  const filtered = createMemo(() => [...runPokedexFilter(pokemons.all, pokedexFilter.state)]);

  createEffect(() => {
    if (pokedexFilter.state && filtered.length === 0) {
      batch(() => {
        pokedexFilter.state = undefined;
        toasts.add("asterisk", "Cleared filter.");
      });
    }
  });

  return (
    <Section id="pokedex" title="Pokédex" count={pokemons.size} hasActions>
      <PokedexMode
        filter={filter}
        pokemons={pokemons}
        filtered={filtered}
        setEditingIndex={(index) => (editingIndex.value = index)}
      />
      {editingIndex.value != null ? (
        <EditPokemonModal
          index={editingIndex.value}
          onClose={() => (editingIndex.value = undefined)}
        />
      ) : null}
    </Section>
  );
}
