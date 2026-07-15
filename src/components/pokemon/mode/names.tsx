import { useComputed } from "@preact/signals";
import { For } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexModeViewProps } from ".";
import type { Pokemon } from "../../../models/pokemon";
import type { Type } from "../../../models/type";
import { ExcludedTypesSet } from "../../../models/type/excluded";
import { ExcludedTypesContext } from "../../../state/context";
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
  const excludedTypes = useContext(ExcludedTypesContext);

  return (
    <li
      class="relative inline-flex cursor-pointer justify-center data-[exclude=true]:opacity-50"
      key={pokemon.id}
      data-id={pokemon.id}
      data-exclude={pokemon.exclude}
    >
      <button
        data-handle
        class="flex w-full cursor-pointer gap-2 border border-divider-light px-4 py-2"
        onClick={onClick}
      >
        <div>{pokemon.name}</div>
        <div class="grow"></div>
        <For each={pokemon.types} getKey={(type) => type.key}>
          {(type) => <TypeIcon type={type} excludedTypes={excludedTypes} />}
        </For>
      </button>
    </li>
  );
}

interface TypeIconProps {
  type: Type;
  excludedTypes: ExcludedTypesSet;
}

function TypeIcon({ type, excludedTypes }: TypeIconProps) {
  const exclude = useComputed(() => excludedTypes.all.value.has(type.key));
  return (
    <div
      title={type.name}
      class="dim data-[exclude=true]:opacity-50"
      style={`color: ${type.color}`}
      data-exclude={exclude}
    >
      <Icon name={type.icon} />
    </div>
  );
}
