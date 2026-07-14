import { batch, useComputed } from "@preact/signals";
import { For, Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { Metrics } from "../../../models/metrics";
import type { PokedexFilter, PokedexFilterState } from "../../../models/pokedex/filter";
import { BUILTIN_TYPES, TYPES, type Type } from "../../../models/type";
import { MetricsContext } from "../../../state/context";
import { toasts } from "../../../state/toast";
import { IconPickerGrid, IconPickerGridItem } from "../../common/menus/icon_picker_grid";
import { Modal } from "../../common/menus/modal";

export interface FilterPokedexModalProps {
  filter: PokedexFilter;
  onClose(): void;
}

export function FilterPokedexModal({ filter, onClose }: FilterPokedexModalProps) {
  const metrics = useContext(MetricsContext);
  const noFilter = useComputed(() => !filter.state.value);
  const sortedCustomTypes = useComputed(() => metrics.pokemonsAllotment.value.sortedCustomTypes);

  function onClickAny() {
    batch(() => {
      filter.state.value = undefined;
      toasts.add("asterisk", "Cleared filter.");
      onClose();
    });
  }

  function onClickType(type: Type) {
    if (filter.typeKey.value === type.key) {
      return onClickAny();
    }
    batch(() => {
      filter.state.value = { kind: "type", typeKey: type.key };
      toasts.add(type.icon, `Set filter to ${type.key}!`);
      onClose();
    });
  }

  return (
    <Modal title="Filter Pokédex" onClose={onClose}>
      <IconPickerGrid>
        <IconPickerGridItem name="Any" icon="asterisk" active={noFilter} onClick={onClickAny} />

        <For each={() => BUILTIN_TYPES.all} getKey={(type) => type.key}>
          {(type) => (
            <TypeItem
              type={type}
              metrics={metrics}
              filter={filter}
              onClick={() => onClickType(type)}
            />
          )}
        </For>

        <For each={sortedCustomTypes} getKey={(type) => type.key}>
          {(type) => (
            <TypeItem
              type={type}
              metrics={metrics}
              filter={filter}
              onClick={() => onClickType(type)}
            />
          )}
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
  metrics: Metrics;
  filter: PokedexFilter;
  onClick(): void;
}

function TypeItem({ type, metrics, filter, onClick }: TypeItemProps) {
  const count = useComputed(() => metrics.pokemonsAllotment.value.types.get(type.key)?.count);
  const active = useComputed(() => filter.typeKey.value === type.key);

  return (
    <Show when={count}>
      {(count) => (
        <IconPickerGridItem
          name={type.name}
          icon={type.icon}
          iconColor={type.color}
          count={count}
          active={active}
          onClick={onClick}
        />
      )}
    </Show>
  );
}

export function filterPokedexActionIcon(state: PokedexFilterState | undefined) {
  if (!state) return "asterisk";
  return TYPES.of(state.typeKey).icon;
}
