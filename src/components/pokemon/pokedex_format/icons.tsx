import { useContext } from "preact/hooks";
import type { Pokemon } from "../../../models/pokemon";
import { PokemonsContext } from "../../../state/context";
import { PokemonIcon } from "../util/pokemon_icon";
import { TypeDots } from "../util/type_dots";

export function PokedexIconsView() {
  const pokemons = useContext(PokemonsContext);
  return (
    <ol class="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8">
      {pokemons.all.value
        .map((pokemon) => {
          return <Item pokemon={pokemon} />;
        })
        .toArray()}
    </ol>
  );
}

interface ItemProps {
  pokemon: Pokemon;
}

function Item({ pokemon }: ItemProps) {
  return (
    <li class="relative">
      <TypeDots types={pokemon.types.value} />
      <PokemonIcon pokemon={pokemon} />
    </li>
  );
}
