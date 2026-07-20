import { For } from "solid-js";

export interface SelectOption<Key extends string> {
  key: Key;
  name: string;
}

export interface SelectProps<Key extends string> {
  active: string | undefined;
  options: SelectOption<Key>[];
  onChange(key: Key): void;
}

export function Select<Key extends string>(props: SelectProps<Key>) {
  return (
    <select
      class="w-full rounded-sm border-2 border-divider-heavy"
      value={props.active}
      onChange={(e) => props.onChange(e.currentTarget.value as Key)}
    >
      <For each={props.options}>
        {(option) => <option value={option.key}>{option.name}</option>}
      </For>
    </select>
  );
}
