import { batch, useSignal } from "@preact/signals";
import type { Pokemon } from "../../../models/pokemon";
import { Input } from "../../common/input";
import { ButtonLink } from "../../common/link";
import { TYPE_SUGGESTIONS_LIST } from "../../types/util/suggestions";

export interface EditPokemonTypesProps {
  pokemon: Pokemon;
}

export function EditPokemonTypes({ pokemon }: EditPokemonTypesProps) {
  const initialTypeKeys = pokemon.typeKeys.peek();
  const type1 = useSignal(initialTypeKeys.at(0) ?? "");
  const type2 = useSignal(initialTypeKeys.at(1) ?? "");

  function synchronize() {
    const newTypeKeys = pokemon.typeKeys.peek();
    type1.value = newTypeKeys.at(0) ?? "";
    type2.value = newTypeKeys.at(1) ?? "";
  }

  function handleBlur(value: string, index: number) {
    batch(() => {
      pokemon.setTypeKeyAt(index, value.trim().toLowerCase());
      synchronize();
    });
  }

  function setPreset(typeKeys: string[] | undefined) {
    batch(() => {
      pokemon.setTypeKeys(typeKeys);
      synchronize();
    });
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

        {pokemon.species.value?.alts.length ? (
          <div class="mt-2">
            <h3 class="text-sm">presets:</h3>
            <ul class="list-inside list-disc">
              <li>
                <ButtonLink onClick={() => setPreset(undefined)}>normal form</ButtonLink>
              </li>
              {pokemon.species.value.alts.map((alt) => (
                <li>
                  <ButtonLink onClick={() => setPreset(alt.typeKeys)}>
                    {alt.nameLower} form
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </div>
        ) : pokemon.typeChanged.value ? (
          <div class="mt-2 ml-2 text-sm">
            <ButtonLink onClick={() => setPreset(undefined)}>reset customized type</ButtonLink>
          </div>
        ) : null}
      </div>
    </div>
  );
}
