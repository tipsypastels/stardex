import { createMemo, For } from "solid-js";
import { pokemons } from "../../models/pokemon/list";
import { CUSTOM_TYPES } from "../../models/type";
import { customTypeColors } from "../../models/type/custom_colors";
import { Modal } from "../common/menus/modal";
import { TypeName } from "./util/name";

export interface CustomTypesModalProps {
  onClose(): void;
}

export function CustomTypesModal(props: CustomTypesModalProps) {
  const types = createMemo(() => CUSTOM_TYPES.onPokemons(pokemons.all));

  return (
    <Modal title="Custom Types" onClose={() => props.onClose()}>
      <ul class="mb-4">
        <For each={types()}>
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
