import { batch, createEffect, createMemo, createSignal } from "solid-js";
import { pokedexFilter, runPokedexFilter } from "../../models/pokedex/filter";
import { pokemons } from "../../models/pokemon/list";
import { toasts } from "../../models/ui/toast";
import { Section } from "../layout/section";
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
    <Section id="pokedex" title="Pokédex" count={pokemons.all.length} hasActions>
      <PokedexMode filtered={filtered()} setEditingIndex={setEditingIndex} />
      {/* {editingIndex() != null ? (
        <EditPokemonModal
          index={editingIndex.value}
          onClose={() => (editingIndex.value = undefined)}
        />
      ) : null} */}
    </Section>
  );
}
