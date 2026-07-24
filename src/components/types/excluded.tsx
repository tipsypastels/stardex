import { Show } from "solid-js";
import { BUILTIN_TYPES, type Type } from "../../models/type";
import { excludedTypes } from "../../models/type/excluded";
import { Icon } from "../common/icon";
import { Modal } from "../common/menus/modal";
import { TypeName } from "../types/util/name";

export interface ExcludedTypesModalProps {
  onClose(): void;
}

export function ExcludedTypesModal(props: ExcludedTypesModalProps) {
  return (
    <Modal title="Excluded Types" onClose={() => props.onClose()}>
      <p class="mb-4">Hacking a game without later types?</p>
      <ul class="mb-4 pl-2">
        <Option type={BUILTIN_TYPES.of("dark")} />
        <Option type={BUILTIN_TYPES.of("steel")} />
        <Option type={BUILTIN_TYPES.of("fairy")} />
      </ul>
      <div class="text-sm">
        <strong>Tip:</strong> Excluded types are only excluded from graphs and recommendations. The
        actual types of the Pokémon in your Pokédex won't change unless you change them yourself.
      </div>
    </Modal>
  );
}

interface OptionProps {
  type: Type;
}

function Option(props: OptionProps) {
  const excluded = () => excludedTypes.all.has(props.type.key);

  return (
    <li class="mb-2 last:mb-0">
      <label class="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          class="hidden"
          checked={excluded()}
          onChange={() => excludedTypes.toggle(props.type.key)}
        />

        <div
          class="flex h-8 w-8 items-center justify-center rounded-md border-2 border-divider-heavy"
          style={{ color: props.type.color }}
        >
          <Show when={excluded()}>
            <Icon name="times" />
          </Show>
        </div>

        <div>
          <strong>
            Exclude <TypeName type={props.type} />
          </strong>
        </div>
      </label>
    </li>
  );
}
