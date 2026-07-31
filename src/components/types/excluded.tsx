import { BUILTIN_TYPES, type Type } from "../../models/type";
import { excludedTypes } from "../../models/type/excluded";
import { Checkbox } from "../common/forms/checkbox";
import { Modal } from "../common/menus/modal";
import { TypeName } from "./util/name";

export interface ExcludedTypesModalProps {
  onClose(): void;
}

export function ExcludedTypesModal(props: ExcludedTypesModalProps) {
  return (
    <Modal title="Excluded Types" onClose={() => props.onClose()}>
      <p class="mb-4">Hacking a game without later types?</p>
      <ul class="mb-4">
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
    <li class="mb-1 last:mb-0">
      <Checkbox
        name={
          <>
            Exclude <TypeName type={props.type} />
          </>
        }
        checked={excluded()}
        onChange={() => excludedTypes.toggle(props.type.key)}
      />
    </li>
  );
}
