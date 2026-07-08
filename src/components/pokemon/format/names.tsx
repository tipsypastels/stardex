import { useContext } from "preact/hooks";
import type { PokedexFilter } from "../../../models/pokedex_filter";
import type { Pokemon } from "../../../models/pokemon";
import { PokemonsContext } from "../../../state/context";
import { Icon } from "../../common/icon";

export interface PokedexNamesViewProps {
  filter: PokedexFilter;
}

export function PokedexNamesView({ filter }: PokedexNamesViewProps) {
  const pokemons = useContext(PokemonsContext);
  return (
    <ol class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
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
      <div class="border-divider-light flex w-full gap-2 border px-4 py-2">
        <div class="grow">{pokemon.name}</div>

        {pokemon.types.value.map((type) => (
          <div title={type.name} class="dim" style={`color: ${type.color}`}>
            <Icon name={type.icon} />
          </div>
        ))}
      </div>
    </li>
  );
}
