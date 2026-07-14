import { useComputed } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import { BUILTIN_TYPES, type Type } from "../../../models/type";
import type { ExcludedTypesSet } from "../../../models/type/excluded";
import { ExcludedTypesContext } from "../../../state/context";
import { Icon } from "../../common/icon";
import { Modal } from "../../common/menus/modal";

export interface ExcludeTypesModalProps {
  onClose(): void;
}

export function ExcludeTypesModal({ onClose }: ExcludeTypesModalProps) {
  const excludedTypes = useContext(ExcludedTypesContext);
  return (
    <Modal title="Excluded Types" onClose={onClose}>
      <p class="mb-4">Hacking a game without later types?</p>

      <ul class="mb-4 pl-2">
        <Option type={BUILTIN_TYPES.of("dark")} excludedTypes={excludedTypes} />
        <Option type={BUILTIN_TYPES.of("steel")} excludedTypes={excludedTypes} />
        <Option type={BUILTIN_TYPES.of("fairy")} excludedTypes={excludedTypes} />
      </ul>

      <div class="text-sm">
        <strong>Tip:</strong> Excluded types will be omitted from graphs and recommendations. The
        types of the Pokémon as shown in the Pokédex won't change unless you change them yourself.
      </div>
    </Modal>
  );
}

interface OptionProps {
  type: Type;
  excludedTypes: ExcludedTypesSet;
}

function Option({ type, excludedTypes }: OptionProps) {
  const excluded = useComputed(() => excludedTypes.all.value.has(type.key));

  return (
    <li class="mb-2 last:mb-0">
      <label class="flex cursor-pointer items-center gap-2" data-checked={excluded}>
        <input
          type="checkbox"
          class="hidden"
          checked={excluded}
          onChange={() => excludedTypes.toggle(type.key)}
        />

        <div
          class="flex h-8 w-8 items-center justify-center rounded-md border-2 border-divider-heavy text-white"
          style={`color: ${type.color}`}
        >
          <Show when={excluded}>
            <Icon name="times" />
          </Show>
        </div>

        <div>
          <strong>Exclude {type.name}</strong>
        </div>
      </label>
    </li>
  );
}
