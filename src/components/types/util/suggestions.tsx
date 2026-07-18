import { For } from "solid-js";
import { BUILTIN_TYPES } from "../../../models/type";

export const TYPE_SUGGESTIONS_LIST = "type_suggestions_list";

export function TypeSuggestions() {
  return (
    <datalist id={TYPE_SUGGESTIONS_LIST}>
      <For each={BUILTIN_TYPES.all}>{(type) => <option value={type.key}>{type.name}</option>}</For>
    </datalist>
  );
}
