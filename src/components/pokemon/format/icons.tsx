import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexFormatViewProps } from ".";
import type { Pokemon } from "../../../models/pokemon";
import { PokemonsContext } from "../../../state/context";
import { TypeDots } from "../../types/util/dots";
import { PokemonIcon } from "../util/pokemon_icon";
import { EmptyFilteredPokedex, EmptyPokedex } from "./empty";
import { useReordering } from "./reorder";

export function PokedexIconsView({ filter, setEditingIndex }: PokedexFormatViewProps) {
  const pokemons = useContext(PokemonsContext);
  const filtered = filter.iterator.value(pokemons.all.value);

  const gridRef = useReordering(pokemons);

  return (
    <Show when={() => pokemons.size.value > 0} fallback={<EmptyPokedex />}>
      <Show when={() => !filtered.isEmpty} fallback={<EmptyFilteredPokedex />}>
        <ol class="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8" ref={gridRef}>
          {/* Dummy, see useReordering. */}
          <li class="hidden"></li>
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
      class={`relative inline-flex justify-center hover:wiggle ${pokemon.exclude.value ? "opacity-50" : ""}`}
      key={pokemon.key}
      data-id={pokemon.key}
    >
      <button class="cursor-pointer" onClick={edit}>
        <TypeDots types={pokemon.types.value} />
        <PokemonIcon pokemon={pokemon} />
      </button>
    </li>
  );
}
