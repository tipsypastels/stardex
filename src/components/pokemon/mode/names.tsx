import type { PokedexModeViewProps } from ".";
import type { Pokemon } from "../../../models/pokemon";
import { Icon } from "../../common/icon";
import { PokedexGridlikeView } from "./util/grid";

export function PokedexNamesView(props: PokedexModeViewProps) {
  return (
    <PokedexGridlikeView
      {...props}
      item={(pokemon, onClick) => <Item pokemon={pokemon} onClick={onClick} />}
      list={(ref, children) => (
        <ol class="grid grid-cols-1 gap-4 md:grid-cols-3" ref={ref}>
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
      class={`relative inline-flex cursor-pointer justify-center ${pokemon.exclude.value ? "opacity-50" : ""}`}
      key={pokemon.key}
      data-id={pokemon.key}
    >
      <button
        data-handle
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
