import { useModel, useSignal } from "@preact/signals";
import { PokedexFilter } from "../../models/pokedex/filter";
import { Section } from "../layout/section";
import { PokedexActions } from "./actions";
import { EditPokemonModal } from "./edit";
import { PokedexFormat } from "./format";

export function Pokedex() {
  const filter = useModel(PokedexFilter);

  const editingIndex = useSignal<number>();

  return (
    <Section id="pokedex" title="Pokedex" hasActions>
      <PokedexFormat
        filter={filter}
        setEditingIndex={(index: number) => (editingIndex.value = index)}
        actions={() => <PokedexActions filter={filter} />}
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
