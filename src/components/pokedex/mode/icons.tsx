import type { PokedexModeViewProps } from ".";
import { pokedexFilter } from "../../../models/pokedex/filter";
import type { Pokemon } from "../../../models/pokemon";
import { TypeDots } from "../../types/util/dots";
import { PokemonIcon } from "../util/pokemon_icon";
import { draggable } from "./util/drag";
import { PokedexGridlikeView } from "./util/grid";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
draggable;

export function PokedexIconsView(props: PokedexModeViewProps) {
  return (
    <PokedexGridlikeView
      {...props}
      item={(pokemon, onClick) => <Item pokemon={pokemon} onClick={onClick} />}
      list={(children) => (
        <ol
          class="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8"
          use:draggable={!pokedexFilter.state}
        >
          {children}
        </ol>
      )}
    />
  );
}

interface ItemProps {
  pokemon: Pokemon;
  onClick(): void;
}

function Item(props: ItemProps) {
  return (
    <li
      class="relative inline-flex justify-center data-[exclude=true]:opacity-50"
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
