import { useComputed } from "@preact/signals";
import { For, Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import { BUILTIN_TYPES, type Type } from "../../../models/type";
import type { ExcludedTypesSet } from "../../../models/type/excluded";
import { ExcludedTypesContext, PokedexModeContext } from "../../../state/context";
import { IconPickerGrid, IconPickerGridItem } from "../../common/menus/icon_picker_grid";
import { Modal } from "../../common/menus/modal";

export interface ExcludeTypesModalProps {
  onClose(): void;
}

export function ExcludeTypesModal({ onClose }: ExcludeTypesModalProps) {
  const pokedexMode = useContext(PokedexModeContext);
  const excludedTypes = useContext(ExcludedTypesContext);
  return (
    <Modal title="Excluded Types" onClose={onClose}>
      <IconPickerGrid>
        <For each={() => BUILTIN_TYPES.all}>
          {(type) => (
            <Option
              type={type}
              excludedTypes={excludedTypes}
              onClick={() => excludedTypes.toggle(type.key)}
            />
          )}
        </For>
      </IconPickerGrid>

      <div class="text-sm">
        <strong>Tip:</strong> Excluded types will be omitted from graphs and recommendations
        <Show when={() => pokedexMode.key.value !== "text"}>
          , and de-emphasized in Pokédex listings
        </Show>
        .
      </div>
    </Modal>
  );
}

interface OptionProps {
  type: Type;
  excludedTypes: ExcludedTypesSet;
  onClick(): void;
}

function Option({ type, excludedTypes, onClick }: OptionProps) {
  const excluded = useComputed(() => excludedTypes.all.value.has(type.key));

  return (
    <IconPickerGridItem
      name={type.name}
      icon={type.icon}
      iconColor={type.color}
      active={excluded}
      onClick={onClick}
    />
  );
}
