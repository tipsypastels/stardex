import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexFilter } from "../../../models/pokedex_filter";
import type { Pokemon } from "../../../models/pokemon";
import { PokemonsContext } from "../../../state/context";
import { TypeDots } from "../../types/util/dots";
import { PokemonIcon } from "../util/pokemon_icon";
import { EmptyFilteredPokedex, EmptyPokedex } from "./empty";

export interface PokedexIconsViewProps {
  filter: PokedexFilter;
}

export function PokedexIconsView({ filter }: PokedexIconsViewProps) {
  const pokemons = useContext(PokemonsContext);
  const filtered = filter.iterator.value(pokemons.all.value);

  return (
    <Show when={() => pokemons.size.value > 0} fallback={<EmptyPokedex />}>
      <Show when={() => !filtered.isEmpty} fallback={<EmptyFilteredPokedex />}>
        <ol class="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8">
          {filtered.toArray().map((pokemon) => (
            <Item pokemon={pokemon} />
          ))}
        </ol>
      </Show>
    </Show>
  );
}

interface ItemProps {
  pokemon: Pokemon;
}

function Item({ pokemon }: ItemProps) {
  return (
    <li class="relative inline-flex cursor-pointer justify-center">
      <TypeDots types={pokemon.types.value} />
      <PokemonIcon pokemon={pokemon} />
    </li>
  );
}
