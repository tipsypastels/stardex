import { useComputed, type ReadonlySignal } from "@preact/signals";
import { For } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { Type } from "../../../models/type";
import type { ExcludedTypesSet } from "../../../models/type/excluded";
import { ExcludedTypesContext } from "../../../state/context";

export interface TypeDotsProps {
  types: ReadonlySignal<Type[]>;
}

export function TypeDots({ types }: TypeDotsProps) {
  const excludedTypes = useContext(ExcludedTypesContext);
  return (
    <ul class="absolute top-0 left-0 flex">
      <For each={types} getKey={(type) => type.key}>
        {(type) => <Dot type={type} excludedTypes={excludedTypes} />}
      </For>
    </ul>
  );
}

interface DotProps {
  type: Type;
  excludedTypes: ExcludedTypesSet;
}

function Dot({ type, excludedTypes }: DotProps) {
  const exclude = useComputed(() => excludedTypes.all.value.has(type.key));
  return (
    <li
      class="mr-1 h-2.5 w-2.5 rounded-full dim data-[exclude=true]:opacity-50"
      style={`background-color: ${type.color}`}
      title={`${type.name} Type`}
      data-exclude={exclude}
    ></li>
  );
}
