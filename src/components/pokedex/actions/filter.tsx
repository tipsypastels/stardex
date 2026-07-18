import { batch, For, Show } from "solid-js";
import { pokemonsAllotment } from "../../../models/metrics";
import { pokedexFilter, type PokedexFilterState } from "../../../models/pokedex/filter";
import { BUILTIN_TYPES, TYPES, type Type } from "../../../models/type";
import { toasts } from "../../../models/ui/toast";
import { IconPickerGrid, IconPickerGridItem } from "../../common/menus/icon_picker_grid";
import { Modal } from "../../common/menus/modal";

export interface FilterPokedexModalProps {
  onClose(): void;
}

export function FilterPokedexModal(props: FilterPokedexModalProps) {
  function onClickAny() {
    batch(() => {
      pokedexFilter.state = undefined;
      toasts.add("asterisk", "Cleared filter.");
      props.onClose();
    });
  }

  function onClickType(type: Type) {
    if (pokedexFilter.typeKey === type.key) {
      return onClickAny();
    }
    batch(() => {
      pokedexFilter.state = { kind: "type", typeKey: type.key };
      toasts.add(type.icon, `Set filter to ${type.key}!`);
      props.onClose();
    });
  }

  return (
    <Modal title="Filter Pokédex" onClose={props.onClose}>
      <IconPickerGrid>
        <IconPickerGridItem
          name="Any"
          icon="asterisk"
          active={!pokedexFilter.state}
          onClick={onClickAny}
        />

        <For each={BUILTIN_TYPES.all}>
          {(type) => <TypeItem type={type} onClick={() => onClickType(type)} />}
        </For>

        <For each={pokemonsAllotment.value.sortedCustomTypes}>
          {(type) => <TypeItem type={type} onClick={() => onClickType(type)} />}
        </For>
      </IconPickerGrid>
      <div class="text-sm">
        <strong>Tip:</strong> You can't drag to reorder your Pokédex while filtering. That would be
        weird.
      </div>
    </Modal>
  );
}

interface TypeItemProps {
  type: Type;
  onClick(): void;
}

function TypeItem(props: TypeItemProps) {
  const count = () => pokemonsAllotment.value.types.get(props.type.key)?.count;
  const active = () => pokedexFilter.typeKey === props.type.key;

  return (
    <Show when={count}>
      {(count) => (
        <IconPickerGridItem
          name={props.type.name}
          icon={props.type.icon}
          iconColor={props.type.color}
          count={count()()}
          active={active()}
          onClick={props.onClick}
        />
      )}
    </Show>
  );
}

export function filterPokedexActionIcon(state: PokedexFilterState | undefined) {
  if (!state) return "asterisk";
  return TYPES.of(state.typeKey).icon;
}
