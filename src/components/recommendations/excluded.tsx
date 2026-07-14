import { useComputed } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { BUILTIN_TYPES, type Type } from "../../models/type";
import type { ExcludedTypesSet } from "../../models/type/excluded";
import { Icon } from "../common/icon";
import { Modal } from "../common/menus/modal";
import { TypeName } from "../types/util/name";

export interface ExcludedTypesModalProps {
  excludedTypes: ExcludedTypesSet;
  onClose(): void;
}

export function ExcludedTypesModal({ excludedTypes, onClose }: ExcludedTypesModalProps) {
  return (
    <Modal title="Excluded Types" onClose={onClose}>
      <p class="mb-4">Hacking a game without later types?</p>
      <ul class="mb-4 pl-2">
        <Option type={BUILTIN_TYPES.of("dark")} excludedTypes={excludedTypes} />
        <Option type={BUILTIN_TYPES.of("steel")} excludedTypes={excludedTypes} />
        <Option type={BUILTIN_TYPES.of("fairy")} excludedTypes={excludedTypes} />
      </ul>
      <div class="mb-2 text-sm">
        <strong>Tip:</strong> Excluded types are only excluded from recommendations. The actual
        types of the Pokémon in your Pokédex won't change unless you change them yourself.
      </div>
      <div class="text-sm text-foreground-lesser">This feature may be expanded in the future.</div>
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
          <strong>
            Don't Recommend <TypeName type={type} />
          </strong>
        </div>
      </label>
    </li>
  );
}
