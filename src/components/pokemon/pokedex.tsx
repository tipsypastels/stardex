import { batch, useComputed, useModel, useSignal, useSignalEffect } from "@preact/signals";
import { useContext } from "preact/hooks";
import { PokedexFilter, runPokedexFilter } from "../../models/pokedex/filter";
import { PokemonsContext } from "../../state/context";
import { toasts } from "../../state/toast";
import { Section } from "../layout/section";
import { EditPokemonModal } from "./edit";
import { PokedexFormat } from "./format";

export function Pokedex() {
  const editingIndex = useSignal<number>();
  const filter = useModel(PokedexFilter);
  const pokemons = useContext(PokemonsContext);
  const pokemonsFiltered = useComputed(() => [
    ...runPokedexFilter(pokemons.all.value, filter.state.value),
  ]);

  useSignalEffect(() => {
    if (filter.state.value && pokemonsFiltered.value.length === 0) {
      batch(() => {
        filter.state.value = undefined;
        toasts.add("asterisk", "Cleared filter.");
      });
    }
  });

  return (
    <Section id="pokedex" title="Pokedex" hotkey="jumpToPokedex" hasActions>
      <PokedexFormat
        filter={filter}
        pokemons={pokemons}
        pokemonsFiltered={pokemonsFiltered}
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
