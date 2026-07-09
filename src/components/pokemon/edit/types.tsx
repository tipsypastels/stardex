import { useSignal } from "@preact/signals";
import type { Pokemon } from "../../../models/pokemon";
import { Input } from "../../common/input";
import { TYPE_SUGGESTIONS_LIST } from "../../types/util/suggestions";

export interface EditPokemonTypesProps {
  pokemon: Pokemon;
}

export function EditPokemonTypes({ pokemon }: EditPokemonTypesProps) {
  const type1 = useSignal(pokemon.typeKeys.peek().at(0) ?? "");
  const type2 = useSignal(pokemon.typeKeys.peek().at(1) ?? "");

  function handleBlur(value: string, index: number) {
    pokemon.setTypeKeyAt(index, value.trim().toLowerCase());
  }

  return (
    <div class="mb-4">
      <h2 class="font-bold">Types</h2>
      <div>
        <Input
          value={type1.value}
          onChange={(e) => (type1.value = e.currentTarget.value)}
          onBlur={() => handleBlur(type1.value, 0)}
          list={TYPE_SUGGESTIONS_LIST}
        />
        {" and "}
        <Input
          value={type2.value}
          onChange={(e) => (type2.value = e.currentTarget.value)}
          onBlur={() => handleBlur(type2.value, 1)}
          list={TYPE_SUGGESTIONS_LIST}
        />
      </div>
    </div>
  );
}
