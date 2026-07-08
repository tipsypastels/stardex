import { useContext } from "preact/hooks";
import type { PokedexFilter } from "../../../models/pokedex_filter";
import type { Pokemon } from "../../../models/pokemon";
import { PokemonsContext } from "../../../state/context";
import { TypeDots } from "../../types/util/type_dots";
import { PokemonIcon } from "../util/pokemon_icon";

export interface PokedexIconsViewProps {
  filter: PokedexFilter;
}

export function PokedexIconsView({ filter }: PokedexIconsViewProps) {
  const pokemons = useContext(PokemonsContext);
  return (
    <ol class="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8">
      {filter.renderPermitted.value(
        pokemons.all.value,
        (pokemon) => (
          <Item pokemon={pokemon} />
        ),
        () => (
          // TODO
          <>none</>
        ),
      )}
    </ol>
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
