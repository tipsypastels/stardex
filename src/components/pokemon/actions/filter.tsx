import { batch } from "@preact/signals";
import { For } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexFilter, PokedexFilterState } from "../../../models/pokedex/filter";
import { TYPES } from "../../../models/type";
import { MetricsContext } from "../../../state/context";
import { toasts } from "../../../state/toast";
import { Icon } from "../../common/icon";
import { Modal } from "../../common/menus/modal";

export interface FilterPokedexModalProps {
  filter: PokedexFilter;
  onClose(): void;
}

export function FilterPokedexModal({ filter, onClose }: FilterPokedexModalProps) {
  const metrics = useContext(MetricsContext);

  function onClickAny() {
    batch(() => {
      filter.state.value = undefined;
      toasts.push({ text: "Cleared filter.", icon: "asterisk" });
      onClose();
    });
  }

  function onClickType(typeKey: string) {
    batch(() => {
      filter.state.value = { kind: "type", typeKey };
      toasts.push({ text: `Set filter to ${typeKey}!`, icon: TYPES.of(typeKey).icon });
      onClose();
    });
  }

  return (
    <Modal title="Filter Pokédex" onClose={onClose}>
      <ul class="mb-4 grid grid-cols-3 gap-4 md:grid-cols-5">
        <FilterOption
          icon="asterisk"
          text="Any"
          active={filter.state.value === undefined}
          setActive={onClickAny}
        />
        <For each={() => [...metrics.pokemonsAllotment.value.types.values()]}>
          {({ type, count }) => (
            <FilterOption
              icon={type.icon}
              text={type.name}
              color={type.color}
              count={count}
              active={filter.typeKey.value === type.key}
              setActive={() => onClickType(type.key)}
            />
          )}
        </For>
      </ul>
      <div class="text-sm">
        <strong>Tip:</strong> You can't drag to reorder your Pokédex while filtering. That would be
        weird.
      </div>
    </Modal>
  );
}

interface FilterOptionProps {
  icon: string;
  text: string;
  color?: string;
  count?: number;
  active: boolean;
  setActive(): void;
}

function FilterOption({ icon, text, color, count, active, setActive }: FilterOptionProps) {
  return (
    <li class={`relative ${active ? "" : "opacity-50"}`}>
      <label class="flex cursor-pointer justify-center select-none">
        <div class="flex flex-col items-center">
          <input class="hidden" type="radio" name="pokedex_filter_type" onClick={setActive} />
          <div class="text-3xl dim" style={`color: ${color}`}>
            <Icon name={icon} />
          </div>
          <div>{text}</div>
        </div>
        {count ? <sub class="text-foreground-lesser">{count}</sub> : null}
      </label>
    </li>
  );
}

export function filterPokedexActionIcon(state: PokedexFilterState | undefined) {
  if (!state) return "asterisk";
  return TYPES.of(state.typeKey).icon;
}
