import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexFormatViewProps } from ".";
import type { Pokemon } from "../../../models/pokemon";
import { PokemonsContext } from "../../../state/context";
import { Icon } from "../../common/icon";
import { useDraggable } from "./util/drag";
import { EmptyFilteredPokedex, EmptyPokedex } from "./util/empty";

export function PokedexNamesView({ filter, setEditingIndex }: PokedexFormatViewProps) {
  const pokemons = useContext(PokemonsContext);
  const filtered = filter.iterator.value(pokemons.all.value);

  // TODO: This is broken :( but only for names.
  const gridRef = useDraggable(pokemons);

  return (
    <Show when={() => pokemons.size.value > 0} fallback={<EmptyPokedex />}>
      <Show when={() => !filtered.isEmpty} fallback={<EmptyFilteredPokedex />}>
        <ol class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3" ref={gridRef}>
          {/* Dummy, see useDraggable. */}
          <li class="hidden"></li>
          {filtered.toArray().map((pokemon, index) => (
            <Item pokemon={pokemon} onClick={() => setEditingIndex(index)} />
          ))}
        </ol>
      </Show>
    </Show>
  );
}

interface ItemProps {
  pokemon: Pokemon;
  onClick(): void;
}

function Item({ pokemon, onClick }: ItemProps) {
  return (
    <li
      class={`relative inline-flex cursor-pointer justify-center ${pokemon.exclude.value ? "opacity-50" : ""}`}
    >
      <button
        class="flex w-full cursor-pointer gap-2 border border-divider-light px-4 py-2"
        onClick={onClick}
      >
        <div>{pokemon.name}</div>
        <div class="grow"></div>
        {pokemon.types.value.map((type) => (
          <div title={type.name} class="dim" style={`color: ${type.color}`}>
            <Icon name={type.icon} />
          </div>
        ))}
      </button>
    </li>
  );
}
