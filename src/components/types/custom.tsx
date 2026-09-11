import { batch, createMemo, createSignal, For, Show } from "solid-js";
import { pokemons } from "../../models/pokemon/list";
import { CUSTOM_TYPES, type Type } from "../../models/type";
import { customTypeColors } from "../../models/type/custom_colors";
import { Empty } from "../common/empty";
import { Dropdown, DropdownDivider, DropdownItem, DropdownTrigger } from "../common/menus/dropdown";
import { Modal } from "../common/menus/modal";
import { runPokedexModeRefreshCallback } from "../pokedex/mode/refresh";
import { TypeName } from "./util/name";

export interface CustomTypesModalProps {
  onClose(): void;
}

export function CustomTypesModal(props: CustomTypesModalProps) {
  const types = createMemo(() => CUSTOM_TYPES.onPokemons(pokemons.all));
  const [dropdownKey, setDropdownKey] = createSignal<string>();

  return (
    <Modal title="Custom Types" onClose={() => props.onClose()}>
      <div class="mb-4">
        <Show
          when={types().length > 0}
          fallback={<Empty>You have no Pokémon with custom types.</Empty>}
        >
          <ul>
            <For each={types()}>
              {(type) => (
                <CustomType
                  type={type}
                  dropdownKey={dropdownKey()}
                  setDropdownKey={setDropdownKey}
                />
              )}
            </For>
          </ul>
        </Show>
      </div>
      <p class="text-sm">
        <strong>Tip:</strong> To add new custom types, just enter the type name on any Pokémon's
        type list. This menu lets you tweak custom types you've already added.
      </p>
    </Modal>
  );
}

interface CustomTypeProps {
  type: Type;
  dropdownKey: string | undefined;
  setDropdownKey(key: string | undefined): void;
}

function CustomType(props: CustomTypeProps) {
  const dropdownOpen = () => props.dropdownKey === props.type.key;

  let colorInput: HTMLInputElement | undefined;

  return (
    <li>
      <div class="flex items-center">
        <div class="flex grow py-2">
          <TypeName type={props.type} />
        </div>

        <DropdownTrigger
          title="Actions"
          open={dropdownOpen()}
          onClick={() => props.setDropdownKey(props.type.key)}
        />
      </div>

      <input
        ref={colorInput}
        // iOS doesn't allow virtual clicks to display:none elements.
        class="pointer-events-none absolute h-0 w-0 opacity-0"
        type="color"
        value={props.type.color}
        onInput={(event) => {
          customTypeColors.set(props.type.key, event.target.value);
        }}
      />

      <Show when={dropdownOpen()}>
        <Dropdown onClose={() => props.setDropdownKey(undefined)}>
          <DropdownItem
            name="Rename"
            icon="pen-to-square"
            onClick={() => {
              const name = prompt(`Enter a new name for the "${props.type.name}" type...`)?.trim();
              if (name && name !== props.type.name) {
                const newType = CUSTOM_TYPES.of(name.toLowerCase());

                batch(() => {
                  pokemons.bulkReplaceTypeKey(props.type.key, newType.key);
                  customTypeColors.replaceKey(props.type.key, newType.key);
                });

                runPokedexModeRefreshCallback();
              }
            }}
          />
          <DropdownDivider />
          <DropdownItem
            name="Edit Colour"
            icon="paintbrush"
            onClick={() => {
              colorInput?.focus();
              colorInput?.click();
            }}
          />
          <DropdownItem
            name="Reset Colour"
            icon="paintbrush-slash"
            onClick={() => {
              customTypeColors.delete(props.type.key);
            }}
          />
        </Dropdown>
      </Show>
    </li>
  );
}
