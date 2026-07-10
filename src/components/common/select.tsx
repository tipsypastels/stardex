import { For } from "@preact/signals/utils";
import type { Signalish } from "preact";

export interface SelectOption<Key extends string> {
  key: Signalish<Key>;
  name: Signalish<string>;
}

export interface SelectProps<Key extends string> {
  active: Signalish<string | undefined>;
  options(): SelectOption<Key>[];
  onChange(key: Key): void;
}

export function Select<Key extends string>({ active, options, onChange }: SelectProps<Key>) {
  return (
    <select
      class="w-full rounded-sm border-2 border-divider-heavy"
      value={active}
      onChange={(e) => onChange(e.currentTarget.value as Key)}
    >
      <For each={options}>
        {(option) => (
          <option key={option.key} value={option.key}>
            {option.name}
          </option>
        )}
      </For>
    </select>
  );
}
