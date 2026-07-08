import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { PokedexFilter } from "../../../models/pokedex_filter";
import { POKEDEX_FORMATS, type PokedexFormat } from "../../../models/pokedex_format";
import { MetricsContext, PokedexFormatContext } from "../../../state/context";
import { Actions } from "../../common/menus/actions";
import { Modal } from "../../common/menus/modal";
import { ModePicker } from "../../common/menus/mode_picker";

export interface PokedexActionsProps {
  filter: PokedexFilter;
}

export function PokedexActions({ filter }: PokedexActionsProps) {
  const format = useContext(PokedexFormatContext);
  const modal = useSignal<"format" | "filter">();

  return (
    <>
      <Actions
        actions={[
          {
            icon: format.icon.value,
            name: "Format",
            onClick: () => (modal.value = "format"),
          },
          {
            icon: filter.icon.value,
            name: "Filter",
            onClick: () => (modal.value = "filter"),
          },
        ]}
      />

      <Show when={() => modal.value === "format"}>
        <FormatModal format={format} onClose={() => (modal.value = undefined)} />
      </Show>

      <Show when={() => modal.value === "filter"}>
        <FilterModal filter={filter} onClose={() => (modal.value = undefined)} />
      </Show>
    </>
  );
}

interface FormatModalProps {
  format: PokedexFormat;
  onClose(): void;
}

function FormatModal({ format, onClose }: FormatModalProps) {
  return (
    <Modal title="Format Pokédex" onClose={onClose}>
      <ModePicker
        modes={POKEDEX_FORMATS.options}
        activeIndex={format.index.value}
        setActiveIndex={(index) => (format.key.value = POKEDEX_FORMATS.keys[index])}
      />
    </Modal>
  );
}

interface FilterModalProps {
  filter: PokedexFilter;
  onClose(): void;
}

function FilterModal({ filter, onClose }: FilterModalProps) {
  const metrics = useContext(MetricsContext);
  return (
    <Modal title="Filter Pokédex" onClose={onClose}>
      <div class="flex items-center">
        <div class="font-bold">Type:</div>
        <select
          class="text-primary mx-1 grow border-0 px-1 py-0 underline"
          value={filter.ofKind.value("type")}
          onChange={(e) => {
            e.preventDefault();
            filter.raw.value = (e.target as HTMLSelectElement).value;
          }}
        >
          <option value={undefined}>Any</option>

          {[...metrics.pokemonsAllotment.value.types.values()].map(({ type, count }) => (
            <option value={`type:${type.key}`}>
              {type.name} ({count})
            </option>
          ))}
        </select>
      </div>
    </Modal>
  );
}
