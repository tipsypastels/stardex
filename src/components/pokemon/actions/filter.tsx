import { useContext } from "preact/hooks";
import type { PokedexFilter } from "../../../models/pokedex/filter";
import { MetricsContext } from "../../../state/context";
import { Modal } from "../../common/menus/modal";

export interface FilterPokedexModalProps {
  filter: PokedexFilter;
  onClose(): void;
}

export function FilterPokedexModal({ filter, onClose }: FilterPokedexModalProps) {
  const metrics = useContext(MetricsContext);
  return (
    <Modal title="Filter Pokédex" onClose={onClose}>
      <div class="flex items-center">
        <div class="font-bold">Type:</div>
        <select
          class="mx-1 grow border-0 px-1 py-0 text-primary underline"
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
