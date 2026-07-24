import { createSignal, Show } from "solid-js";
import { pokemons } from "../../models/pokemon/list";
import { Section } from "../layout/section";
import { EditPokemonModal } from "./edit";
import { PokedexMode } from "./mode";

export function Pokedex() {
  const [editingId, setEditingId] = createSignal<string>();

  return (
    <Section id="pokedex" title="Pokédex" count={pokemons.all.length} hasActions>
      <PokedexMode setEditingId={setEditingId} />
      <Show when={editingId()}>
        {(id) => <EditPokemonModal id={id()} onClose={() => setEditingId(undefined)} />}
      </Show>
    </Section>
  );
}
