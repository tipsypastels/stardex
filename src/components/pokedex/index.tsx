import { batch, createEffect, createSignal } from "solid-js";
import { pokedexFilter, pokemonsFiltered } from "../../models/pokedex/filter";
import { pokemons } from "../../models/pokemon/list";
import { toasts } from "../../models/ui/toast";
import { Section } from "../layout/section";
import { PokedexMode } from "./mode";

export function Pokedex() {
  const [editingId, setEditingId] = createSignal<string>();

  createEffect(() => {
    if (pokedexFilter.state && pokemonsFiltered.all.length === 0) {
      batch(() => {
        pokedexFilter.state = undefined;
        toasts.add("asterisk", "Cleared filter.");
      });
    }
  });

  return (
    <Section id="pokedex" title="Pokédex" count={pokemons.all.length} hasActions>
      <PokedexMode setEditingId={setEditingId} />
      {/* {editingIndex() != null ? (
        <EditPokemonModal
          index={editingIndex.value}
          onClose={() => (editingIndex.value = undefined)}
        />
      ) : null} */}
    </Section>
  );
}
