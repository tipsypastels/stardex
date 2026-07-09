import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexFormatViewProps } from ".";
import type { Pokemon } from "../../../models/pokemon";
import { PokemonsContext } from "../../../state/context";
import { TypeDots } from "../../types/util/dots";
import { PokemonIcon } from "../util/pokemon_icon";
import { EmptyFilteredPokedex, EmptyPokedex } from "./empty";

export function PokedexIconsView({ filter, setEditingIndex }: PokedexFormatViewProps) {
  const pokemons = useContext(PokemonsContext);
  const filtered = filter.iterator.value(pokemons.all.value);

  return (
    <Show when={() => pokemons.size.value > 0} fallback={<EmptyPokedex />}>
      <Show when={() => !filtered.isEmpty} fallback={<EmptyFilteredPokedex />}>
        <ol class="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8">
          {filtered.toArray().map((pokemon, index) => (
            <Item pokemon={pokemon} edit={() => setEditingIndex(index)} />
          ))}
        </ol>
      </Show>
    </Show>
  );
}

interface ItemProps {
  pokemon: Pokemon;
  edit(): void;
}

function Item({ pokemon, edit }: ItemProps) {
  return (
    <li
      class={`relative inline-flex justify-center transition ${pokemon.exclude.value ? "opacity-50" : ""}`}
    >
      <button class="cursor-pointer" onClick={edit}>
        <TypeDots types={pokemon.types.value} />
        <PokemonIcon pokemon={pokemon} />
      </button>
    </li>
  );
}
