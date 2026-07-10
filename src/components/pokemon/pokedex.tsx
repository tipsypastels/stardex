import { useSignal } from "@preact/signals";
import { Section } from "../layout/section";
import { EditPokemonModal } from "./edit";
import { PokedexFormat } from "./format";

export function Pokedex() {
  const editingIndex = useSignal<number>();

  return (
    <Section id="pokedex" title="Pokedex" hasActions>
      <PokedexFormat setEditingIndex={(index: number) => (editingIndex.value = index)} />

      {editingIndex.value != null ? (
        <EditPokemonModal
          index={editingIndex.value}
          onClose={() => (editingIndex.value = undefined)}
        />
      ) : null}
    </Section>
  );
}
