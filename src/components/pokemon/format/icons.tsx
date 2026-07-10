import { Show } from "@preact/signals/utils";
import { useContext, useEffect, useRef } from "preact/hooks";
import Sortable from "sortablejs";
import type { PokedexFormatViewProps } from ".";
import type { Pokemon } from "../../../models/pokemon";
import { PokemonsContext } from "../../../state/context";
import { assert } from "../../../utils/assert";
import { TypeDots } from "../../types/util/dots";
import { PokemonIcon } from "../util/pokemon_icon";
import { EmptyFilteredPokedex, EmptyPokedex } from "./empty";

export function PokedexIconsView({ filter, setEditingIndex }: PokedexFormatViewProps) {
  const pokemons = useContext(PokemonsContext);
  const filtered = filter.iterator.value(pokemons.all.value);

  const gridRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      const sortable = Sortable.create(gridRef.current, {
        animation: 150,
        onEnd(event) {
          assert(event.oldIndex != null && event.newIndex != null);
          // Account for the hidden starting element (see below).
          pokemons.move(event.oldIndex - 1, event.newIndex - 1);
        },
      });
      return () => sortable.destroy();
    }
  }, []);

  return (
    <Show when={() => pokemons.size.value > 0} fallback={<EmptyPokedex />}>
      <Show when={() => !filtered.isEmpty} fallback={<EmptyFilteredPokedex />}>
        <ol class="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8" ref={gridRef}>
          <li class="hidden">
            {/* NOTE: Moving items to index zero causes a desync between the state and sortable.
              I haven't figured out why, possibly zero being falsey breaking something?
              But instead we just create a dummy element at the start. Hate that this worked. */}
          </li>
          {filtered.toArray().map((pokemon, index) => (
            <Item index={index} pokemon={pokemon} edit={() => setEditingIndex(index)} />
          ))}
        </ol>
      </Show>
    </Show>
  );
}

interface ItemProps {
  index: number;
  pokemon: Pokemon;
  edit(): void;
}

function Item({ index, pokemon, edit }: ItemProps) {
  console.log("render", index, pokemon.name.peek());
  return (
    <li
      class={`relative inline-flex justify-center ${pokemon.exclude.value ? "opacity-50" : ""}`}
      key={pokemon.key}
    >
      <button class="cursor-pointer" onClick={edit}>
        <TypeDots types={pokemon.types.value} />
        <PokemonIcon pokemon={pokemon} />
      </button>
    </li>
  );
}
