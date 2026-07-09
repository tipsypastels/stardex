import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexFilter } from "../../../models/pokedex_filter";
import type { Pokemon } from "../../../models/pokemon";
import { PokemonsContext } from "../../../state/context";
import { Icon } from "../../common/icon";
import { EmptyFilteredPokedex, EmptyPokedex } from "./empty";

export interface PokedexNamesViewProps {
  filter: PokedexFilter;
}

export function PokedexNamesView({ filter }: PokedexNamesViewProps) {
  const pokemons = useContext(PokemonsContext);
  const filtered = filter.iterator.value(pokemons.all.value);

  return (
    <Show when={() => pokemons.size.value > 0} fallback={<EmptyPokedex />}>
      <Show when={() => !filtered.isEmpty} fallback={<EmptyFilteredPokedex />}>
        <ol class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
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
