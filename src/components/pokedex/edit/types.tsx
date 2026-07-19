import { For } from "solid-js";
import type { Pokemon } from "../../../models/pokemon";
import type { PokemonMutator } from "../../../models/pokemon/mutator";
import { Input } from "../../common/input";
import { ButtonLink } from "../../common/link";
import { TYPE_SUGGESTIONS_LIST } from "../../types/util/suggestions";

export interface EditPokemonTypesProps {
  pokemon: Pokemon;
  mutator: PokemonMutator;
}

export function EditPokemonTypes(props: EditPokemonTypesProps) {
  let input1: HTMLInputElement | undefined;
  let input2: HTMLInputElement | undefined;

  function synchronize() {
    const [key1, key2] = props.pokemon.typeKeys;
    if (input1) input1.value = key1 ?? "";
    if (input2) input2.value = key2 ?? "";
  }

  function set(index: number, typeKey: string) {
    props.mutator.setTypeKeyAt(index, typeKey.trim().toLowerCase());
    synchronize();
  }

  function setPreset(typeKeys: string[] | undefined) {
    props.mutator.setTypeKeys(typeKeys);
    synchronize();
  }

  return (
    <div class="mb-4">
      <h2 class="font-bold">Types</h2>
      <div>
        <Input
          ref={input1}
          value={props.pokemon.typeKeys.at(0) ?? ""}
          list={TYPE_SUGGESTIONS_LIST}
          onChange={(e) => set(0, e.currentTarget.value)}
        />
        {" and "}
        <Input
          ref={input2}
          value={props.pokemon.typeKeys.at(1) ?? ""}
          list={TYPE_SUGGESTIONS_LIST}
          onChange={(e) => set(1, e.currentTarget.value)}
        />

        {props.pokemon.species?.alts.length ? (
          <div class="mt-2">
            <h3 class="text-sm">presets:</h3>
            <ul class="list-inside list-disc">
              <li>
                <ButtonLink onClick={() => setPreset(undefined)}>normal form</ButtonLink>
              </li>
              <For each={props.pokemon.species.alts}>
                {(alt) => (
                  <li>
                    <ButtonLink onClick={() => setPreset(alt.typeKeys)}>
                      {alt.nameLower} form
                    </ButtonLink>
                  </li>
                )}
              </For>
            </ul>
          </div>
        ) : props.pokemon.isBuiltin() && props.pokemon.changedTypeKeys ? (
          <div class="mt-2 ml-2 text-sm">
            <ButtonLink onClick={() => setPreset(undefined)}>reset customized type</ButtonLink>
          </div>
        ) : null}
      </div>
    </div>
  );
}
