import { useContext } from "preact/hooks";
import type { Pokemon } from "../../models/pokemon";
import { PokemonsContext } from "../../state/context";
import { Actions } from "../common/actions";
import { PokemonIcon } from "./util/pokemon_icon";
import { TypeDots } from "./util/type_dots";

export function Pokedex() {
  return (
    <>
      <Actions
        actions={[
          {
            icon: "asterisk",
            name: "Filter",
            onClick: () => {},
          },
          {
            icon: "asterisk",
            name: "Filter",
            onClick: () => {},
          },
          {
            icon: "asterisk",
            name: "Filter",
            onClick: () => {},
          },
        ]}
      />
      <GridIcons />
    </>
  );
}

function GridIcons() {
  const pokemons = useContext(PokemonsContext);
  return (
    <ol class="mb-4 grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8">
      {pokemons.all.value
        .map((pokemon) => {
          return <ItemIcons pokemon={pokemon} />;
        })
        .toArray()}
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
