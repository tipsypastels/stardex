import { For } from "solid-js";
import type { Type } from "../../../models/type";
import { excludedTypes } from "../../../models/type/excluded";

export interface TypeDotsProps {
  types: Type[];
}

export function TypeDots(props: TypeDotsProps) {
  return (
    <ul class="absolute top-0 left-0 flex">
      <For each={props.types}>
        {(type) => (
          <li
            class="mr-1 h-2.5 w-2.5 rounded-full dim"
            classList={{ "opacity-50": excludedTypes.all.has(type.key) }}
            style={{ "background-color": type.color }}
            title={`${type.name} Type`}
          />
        )}
      </For>
    </ul>
  );
}
