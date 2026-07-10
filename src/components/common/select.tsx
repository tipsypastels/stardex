import { For } from "@preact/signals/utils";
import type { Signalish } from "preact";

export interface SelectOption<Id extends string> {
  id: Signalish<Id>;
  name: Signalish<string>;
}

export interface SelectProps<Id extends string> {
  active: Signalish<string | undefined>;
  options(): SelectOption<Id>[];
  onChange(id: Id): void;
}

export function Select<Id extends string>({ active, options, onChange }: SelectProps<Id>) {
  return (
    <select
      class="w-full rounded-sm border-2 border-divider-heavy"
      value={active}
      onChange={(e) => onChange(e.currentTarget.value as Id)}
    >
      <For each={options}>{(option) => <option value={option.id}>{option.name}</option>}</For>
    </select>
  );
}
