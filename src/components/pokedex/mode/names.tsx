import { For, Show } from "solid-js";
import type { PokedexModeViewProps } from ".";
import { pokedexFilter, pokemonsFiltered } from "../../../models/pokedex/filter";
import type { Pokemon } from "../../../models/pokemon";
import { pokemons } from "../../../models/pokemon/list";
import { excludedTypes } from "../../../models/type/excluded";
import { Icon } from "../../common/icon";
import { EmptyPokedex } from "../empty";
import { onClickPokemon } from "./util/click";
import { createDraggable } from "./util/drag";

export function PokedexNamesView(props: PokedexModeViewProps) {
  const { list } = createDraggable(() => !pokedexFilter.state);
  return (
    <Show when={pokemons.all.length > 0} fallback={<EmptyPokedex />}>
      <ol ref={list} class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <For each={pokemonsFiltered.all}>
          {(pokemon) => {
            return (
              <Item
                pokemon={pokemon}
                onClick={() => onClickPokemon(pokemon, props.zapper, props.setEditingId)}
              />
            );
          }}
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
      class="relative inline-flex cursor-pointer justify-center data-[exclude=true]:opacity-50"
      classList={{ "opacity-50": props.pokemon.exclude }}
      data-id={props.pokemon.id}
    >
      <button
        data-handle
        class="flex w-full cursor-pointer gap-2 border border-divider-light px-4 py-2"
        onClick={() => props.onClick()}
      >
        <div>{props.pokemon.name}</div>
        <div class="grow" />
        <For each={props.pokemon.types}>
          {(type) => (
            <div
              title={type.name}
              class="dim data-[exclude=true]:opacity-50"
              classList={{ "opacity-50": excludedTypes.all.has(type.key) }}
              style={{ color: type.color }}
            >
              <Icon name={type.icon} />
            </div>
          )}
        </For>
      </button>
    </li>
  );
}
