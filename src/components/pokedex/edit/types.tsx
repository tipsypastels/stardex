import { For, Show } from "solid-js";
import type { Pokemon } from "../../../models/pokemon";
import type { PokemonMutator } from "../../../models/pokemon/mutator";
import { capitalizeWords } from "../../../utils/string";
import { Checkbox } from "../../common/forms/checkbox";
import { Input } from "../../common/forms/input";
import { ButtonLink } from "../../common/link";
import { TYPE_SUGGESTIONS_LIST } from "../../types/util/suggestions";

export interface EditPokemonTypesProps {
  pokemon: Pokemon;
  mutator: PokemonMutator;
}

export function EditPokemonTypes(props: EditPokemonTypesProps) {
  const customAltName = () =>
    props.pokemon.isBuiltin() ? props.pokemon.customAltName : props.pokemon.altName;

  let customAltNameInput: HTMLInputElement | undefined;

  function set(index: number, typeKey: string) {
    props.mutator.setTypeKeyAt(index, typeKey.trim().toLowerCase());
  }

  function setDefault() {
    props.mutator.unsetTypeKeysAndAlt();
  }

  function setAltKind(altKind: string) {
    props.mutator.setAltKind(altKind);
  }

  function setCustomAltName(name: string | undefined) {
    props.mutator.setCustomAltName(name && capitalizeWords(name));
  }

  return (
    <div class="mb-4">
      <h2 class="font-bold">Types</h2>
      <div>
        <div class="mb-2">
          <Input
            class="w-20"
            value={props.pokemon.typeKeys.at(0) ?? ""}
            list={TYPE_SUGGESTIONS_LIST}
            visuallyLowercase
            onChange={(e) => set(0, e.currentTarget.value)}
          />
          {" and "}
          <Input
            class="w-20"
            value={props.pokemon.typeKeys.at(1) ?? ""}
            list={TYPE_SUGGESTIONS_LIST}
            visuallyLowercase
            onChange={(e) => set(1, e.currentTarget.value)}
          />
        </div>

        <div>
          <h3 class="text-sm">form{props.pokemon.isBuiltin() ? "" : " name"}:</h3>
          <ul>
            <li>
              {props.pokemon.isBuiltin() ? (
                <Checkbox
                  name={props.pokemon.species.noAltName ?? "Normal"}
                  radio
                  checked={!props.pokemon.altKind && !props.pokemon.customAltName}
                  onChange={setDefault}
                >
                  <Show
                    when={
                      !props.pokemon.altKind &&
                      !props.pokemon.customAltName &&
                      props.pokemon.changedTypeKeys
                    }
                  >
                    <div class="ml-1 text-sm">
                      <ButtonLink onClick={setDefault}>(reset type?)</ButtonLink>
                    </div>
                  </Show>
                </Checkbox>
              ) : (
                <Checkbox
                  name="Unset"
                  radio
                  checked={!props.pokemon.altName}
                  onChange={() => setCustomAltName(undefined)}
                />
              )}
            </li>

            {props.pokemon.species?.alts.length ? (
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
                            (reset type?)
                          </ButtonLink>
                        </div>
                      </Show>
                    </Checkbox>
                  </li>
                )}
              </For>
            ) : null}

            <li>
              <Checkbox
                name="Custom:"
                radio
                checked={!!customAltName()}
                onClick={() => customAltNameInput?.focus()}
              >
                <Input
                  ref={customAltNameInput}
                  class="ml-2 w-30"
                  value={customAltName() ?? ""}
                  onChange={(e) => setCustomAltName(e.currentTarget.value)}
                  short
                  visuallyLowercase
                />
              </Checkbox>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
