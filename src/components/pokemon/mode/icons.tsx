import type { PokedexModeViewProps } from ".";
import type { Pokemon } from "../../../models/pokemon";
import { TypeDots } from "../../types/util/dots";
import { PokemonIcon } from "../util/pokemon_icon";
import { PokedexGridlikeView } from "./util/grid";

export function PokedexIconsView(props: PokedexModeViewProps) {
  return (
    <PokedexGridlikeView
      {...props}
      item={(pokemon, onClick) => <Item pokemon={pokemon} onClick={onClick} />}
      list={(ref, children) => (
        <ol class="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8" ref={ref}>
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

function Item({ pokemon, onClick }: ItemProps) {
  return (
    <li
      class="relative inline-flex justify-center data-[exclude=true]:opacity-50"
      key={pokemon.id}
      data-id={pokemon.id}
      data-exclude={pokemon.exclude}
    >
      <button data-handle class="cursor-pointer" onClick={onClick}>
        <TypeDots types={pokemon.types} />
        <div class="hover:wiggle">
          <PokemonIcon pokemon={pokemon} />
        </div>
      </button>
    </li>
  );
}
