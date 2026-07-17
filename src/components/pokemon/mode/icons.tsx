import type { ComponentChildren } from "preact";
import { memo, useCallback, type RefObject } from "preact/compat";
import type { PokedexModeViewProps } from ".";
import type { Pokemon } from "../../../models/pokemon";
import { PokemonIcon } from "../util/pokemon_icon";
import { PokedexGridlikeView } from "./util/grid";

export function PokedexIconsView(props: PokedexModeViewProps) {
  const item = useCallback((pokemon: Pokemon, onClick: () => void) => {
    return <Item pokemon={pokemon} onClick={onClick} />;
  }, []);

  const list = useCallback((ref: RefObject<HTMLOListElement>, children: ComponentChildren) => {
    return (
      <ol class="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8" ref={ref}>
        {children}
      </ol>
    );
  }, []);

  return <PokedexGridlikeView {...props} item={item} list={list} />;
}

interface ItemProps {
  pokemon: Pokemon;
  onClick(): void;
}

const Item = memo(Item_, () => true);

function Item_({ pokemon, onClick }: ItemProps) {
  return (
    <li
      class="relative inline-flex justify-center data-[exclude=true]:opacity-50"
      key={pokemon.id}
      data-id={pokemon.id}
      data-exclude={pokemon.exclude}
    >
      <button data-handle class="cursor-pointer" onClick={onClick}>
        {/* <TypeDots types={pokemon.types} /> */}
        <div class="hover:wiggle">
          <PokemonIcon pokemon={pokemon} />
        </div>
      </button>
    </li>
  );
}
