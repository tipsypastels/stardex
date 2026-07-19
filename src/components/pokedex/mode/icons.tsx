import { For, Show } from "solid-js";
import type { PokedexModeViewProps } from ".";
import { pokedexFilter, pokemonsFiltered } from "../../../models/pokedex/filter";
import type { Pokemon } from "../../../models/pokemon";
import { pokemons } from "../../../models/pokemon/list";
import { TypeDots } from "../../types/util/dots";
import { EmptyPokedex } from "../empty";
import { PokemonIcon } from "../util/pokemon_icon";
import { onClickPokemon } from "./util/click";
import { draggable } from "./util/drag";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
draggable;

export function PokedexIconsView(props: PokedexModeViewProps) {
  return (
    <Show when={pokemons.all.length > 0} fallback={<EmptyPokedex />}>
      <ol
        class="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8"
        use:draggable={!pokedexFilter.state}
      >
        <For each={pokemonsFiltered.all}>
          {(pokemon) => (
            <Item
              pokemon={pokemon}
              onClick={() => onClickPokemon(pokemon, props.zapper, props.setEditingId)}
            />
          )}
        </For>
      </ol>
    </Show>
  );
}

interface ItemProps {
  pokemon: Pokemon;
  onClick(): void;
}

function Item(props: ItemProps) {
  return (
    <li
      class="relative inline-flex justify-center"
      classList={{ "opacity-50": props.pokemon.exclude }}
      data-id={props.pokemon.id}
    >
      <button data-handle class="cursor-pointer" onClick={() => props.onClick()}>
        <TypeDots types={props.pokemon.types} />
        <div class="hover:wiggle">
          <PokemonIcon pokemon={props.pokemon} />
        </div>
      </button>
    </li>
  );
}
