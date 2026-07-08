import { useContext } from "preact/hooks";
import type { Pokemon } from "../../models/pokemon";
import { PokemonsContext } from "../../state/context";
import { PokemonIcon } from "./util/pokemon_icon";
import { TypeDots } from "./util/type_dots";

export function Pokedex() {
  return <GridIcons />;
}

function GridIcons() {
  const pokemons = useContext(PokemonsContext);
  return (
    <ol class="mb-4 grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8">
      {pokemons.map((pokemon) => {
        return <ItemIcons pokemon={pokemon} />;
      })}
    </ol>
  );
}

interface ItemProps {
  pokemon: Pokemon;
}

function ItemIcons({ pokemon }: ItemProps) {
  return (
    <li class="relative">
      <TypeDots types={pokemon.types.value} />
      <PokemonIcon pokemon={pokemon} />
    </li>
  );
}
