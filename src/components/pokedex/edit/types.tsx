import { For } from "solid-js";
import type { Pokemon } from "../../../models/pokemon";
import type { PokemonMutator } from "../../../models/pokemon/mutator";
import { Checkbox } from "../../common/forms/checkbox";
import { Input } from "../../common/forms/input";
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

  function setDefault() {
    props.mutator.unsetTypeKeysAndAlt();
    synchronize();
  }

  function setAltKind(altKind: string) {
    props.mutator.setAltKind(altKind);
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
            <h3 class="text-sm">forms:</h3>
            <ul>
              <li>
                <Checkbox
                  name={props.pokemon.species.noAltName ?? "Normal"}
                  radio
                  checked={!props.pokemon.altKind}
                  onChange={setDefault}
                />
              </li>
              <For each={props.pokemon.species.alts}>
                {(alt) => (
                  <li>
                    <Checkbox
                      name={alt.name}
                      radio
                      checked={props.pokemon.altKind === alt.kind}
                      onChange={() => setAltKind(alt.kind)}
                    />
                  </li>
                )}
              </For>
            </ul>
          </div>
        ) : props.pokemon.isBuiltin() && props.pokemon.changedTypeKeys ? (
          <div class="mt-2 ml-2 text-sm">
            <ButtonLink onClick={setDefault}>reset customized type</ButtonLink>
          </div>
        ) : null}
      </div>
    </div>
  );
}
