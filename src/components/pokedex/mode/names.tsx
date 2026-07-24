import { For, Show } from "solid-js";
import type { PokedexModeViewProps } from ".";
import { pokemonsFiltered } from "../../../models/pokedex/filter";
import type { Pokemon } from "../../../models/pokemon";
import { pokemons } from "../../../models/pokemon/list";
import { excludedTypes } from "../../../models/type/excluded";
import { Icon } from "../../common/icon";
import { WithFilterNone } from "../filter_none";
import { PokedexHelp } from "../help";
import { onClickPokemon } from "./util/click";
import { createDraggable } from "./util/drag";

export function PokedexNamesView(props: PokedexModeViewProps) {
  const { list } = createDraggable();
  return (
    <>
      <Show when={pokemons.all.length > 0}>
        <WithFilterNone>
          <ol ref={list} class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
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
        </WithFilterNone>
      </Show>
      <PokedexHelp />
    </>
  );
}

interface ItemProps {
  pokemon: Pokemon;
  onClick(): void;
}

function Item(props: ItemProps) {
  return (
    <li
      class="relative inline-flex cursor-pointer justify-center"
      classList={{ "opacity-50": props.pokemon.exclude }}
      data-id={props.pokemon.id}
    >
      <button
        class="relative flex w-full cursor-pointer gap-2 rounded-md border-2 border-divider-card px-4 py-2"
        onClick={() => props.onClick()}
      >
        <Show when={props.pokemon.altNameOrNoAltName}>
          {(name) => (
            <div class="absolute -top-2.5 left-2 bg-background px-1 text-xs">{name()}</div>
          )}
        </Show>
        <div>{props.pokemon.name}</div>
        <div class="grow" />
        <For each={props.pokemon.types}>
          {(type) => (
            <div
              title={type.name}
              class="dim"
              classList={{ "opacity-50": excludedTypes.all.has(type.key) }}
              style={{ color: type.color }}
            >
              <Icon name={type.icon} />
            </div>
          )}
        </For>
        <div class="flex items-center text-sm text-foreground-muted" data-handle>
          <Icon name="grip-vertical" />
        </div>
      </button>
    </li>
  );
}
