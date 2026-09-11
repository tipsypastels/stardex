import { createSignal, For, Show } from "solid-js";
import { type Type } from "../../models/type";
import { customTypeColors } from "../../models/type/custom_colors";
import { Dropdown, DropdownDivider, DropdownItem, DropdownTrigger } from "../common/menus/dropdown";
import { Modal } from "../common/menus/modal";
import { TypeName } from "./util/name";

export interface CustomTypesModalProps {
  types: Type[];
  onClose(): void;
}

export function CustomTypesModal(props: CustomTypesModalProps) {
  const [dropdownKey, setDropdownKey] = createSignal<string>();

  return (
    <Modal title="Custom Types" onClose={() => props.onClose()}>
      <ul class="mb-4">
        <For each={props.types}>
          {(type) => (
            <CustomType type={type} dropdownKey={dropdownKey()} setDropdownKey={setDropdownKey} />
          )}
        </For>
      </ul>
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
        class="hidden"
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
              // TODO
            }}
          />
          <DropdownDivider />
          <DropdownItem
            name="Edit Colour"
            icon="paintbrush"
            onClick={() => {
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
