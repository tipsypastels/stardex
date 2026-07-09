import { BUILTIN_TYPES } from "../../../models/type";

export const TYPE_SUGGESTIONS_LIST = "type_suggestions_list";

export function TypeSuggestions() {
  return (
    <datalist id={TYPE_SUGGESTIONS_LIST}>
      {BUILTIN_TYPES.all.map((type) => (
        <option value={type.key}>{type.name}</option>
      ))}
    </datalist>
  );
}
