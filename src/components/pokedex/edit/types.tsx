import { For, Show } from "solid-js";
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
  function set(index: number, typeKey: string) {
    props.mutator.setTypeKeyAt(index, typeKey.trim().toLowerCase());
  }

  function setDefault() {
    props.mutator.unsetTypeKeysAndAlt();
  }

  function setAltKind(altKind: string) {
    props.mutator.setAltKind(altKind);
  }

  return (
    <div class="mb-4">
      <h2 class="font-bold">Types</h2>
      <div>
        <Input
          value={props.pokemon.typeKeys.at(0) ?? ""}
          list={TYPE_SUGGESTIONS_LIST}
          onChange={(e) => set(0, e.currentTarget.value)}
        />
        {" and "}
        <Input
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
                >
                  <Show when={!props.pokemon.altKind && props.pokemon.changedTypeKeys}>
                    <div class="ml-1 text-sm">
                      <ButtonLink onClick={setDefault}>(reset customized type?)</ButtonLink>
                    </div>
                  </Show>
                </Checkbox>
              </li>
              <For each={props.pokemon.species.alts}>
                {(alt) => (
                  <li>
                    <Checkbox
                      name={alt.name}
                      radio
                      checked={props.pokemon.altKind === alt.kind}
                      onChange={() => setAltKind(alt.kind)}
                    >
                      <Show
                        when={props.pokemon.altKind === alt.kind && props.pokemon.changedTypeKeys}
                      >
                        <div class="ml-1 text-sm">
                          <ButtonLink onClick={() => setAltKind(alt.kind)}>
                            (reset customized type?)
                          </ButtonLink>
                        </div>
                      </Show>
                    </Checkbox>
                  </li>
                )}
              </For>
            </ul>
          </div>
        ) : props.pokemon.isBuiltin() && props.pokemon.changedTypeKeys ? (
          <div class="mt-2 text-sm">
            <ButtonLink onClick={setDefault}>reset customized type?</ButtonLink>
          </div>
        ) : null}
      </div>
    </div>
  );
}
