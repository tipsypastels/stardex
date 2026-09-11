import { For } from "solid-js";
import { type Type } from "../../models/type";
import { customTypeColors } from "../../models/type/custom_colors";
import { Modal } from "../common/menus/modal";
import { TypeName } from "./util/name";

export interface CustomTypesModalProps {
  types: Type[];
  onClose(): void;
}

export function CustomTypesModal(props: CustomTypesModalProps) {
  return (
    <Modal title="Custom Types" onClose={() => props.onClose()}>
      <ul class="mb-4">
        <For each={props.types}>
          {(type) => (
            <li class="flex border-b-2 border-b-divider-light py-2 first:pt-0 last:border-b-0 last:pb-0">
              <div class="grow">
                <TypeName type={type} />
              </div>
              <div class="dim">
                <input
                  type="color"
                  value={type.color}
                  onInput={(event) => {
                    customTypeColors.set(type.key, event.target.value);
                  }}
                />
              </div>
            </li>
          )}
        </For>
      </ul>
    </Modal>
  );
}
