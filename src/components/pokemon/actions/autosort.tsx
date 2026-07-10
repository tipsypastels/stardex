import { useComputed, useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import type { AutosortFailureMode, AutosortRequest } from "../../../models/pokemon/autosort";
import { REGIONS, type RegionKey } from "../../../models/region";
import { Button } from "../../common/button";
import { Modal } from "../../common/menus/modal";
import { Select } from "../../common/select";

export interface AutosortPokedexModalProps {
  onAutosort(request: AutosortRequest): void;
  onClose(): void;
}

type SorterId = "id" | `region-${RegionKey}` | "types";

const SORTERS: { id: SorterId; name: string }[] = [
  {
    id: "id",
    name: "By National Dex Number",
  },
  ...REGIONS.all.map((region) => ({
    id: `region-${region.key}` as SorterId,
    name: `By ${region.name} Dex Number`,
  })),
  {
    id: "types",
    name: "By Types",
  },
];

const FAILURE_MODES: { id: AutosortFailureMode; name: string }[] = [
  { id: "end", name: "Moved to the end" },
  { id: "start", name: "Moved to the start" },
  { id: "remove", name: "Removed from the dex" },
];

export function AutosortPokedexModal({ onAutosort, onClose }: AutosortPokedexModalProps) {
  const sorter = useSignal<SorterId>("id");
  const failure = useSignal<AutosortFailureMode>("end");

  const request = useComputed((): AutosortRequest => {
    switch (sorter.value) {
      case "id": {
        return { kind: "id", failure: failure.value };
      }
      case "types": {
        return { kind: "types" };
      }
      default: {
        const region = sorter.value.split("-")[1] as RegionKey;
        return { kind: "region", region, failure: failure.value };
      }
    }
  });

  return (
    <Modal
      title="Autosort Pokédex"
      onClose={onClose}
      footer={
        <div class="flex flex-col justify-center">
          <Button onClick={() => onAutosort(request.value)}>Autosort</Button>
        </div>
      }
    >
      <Select active={sorter} options={() => SORTERS} onChange={(v) => (sorter.value = v)} />
      <Show when={() => sorter.value !== "types"}>
        <div class="py-2 text-center text-sm">
          <Show
            when={() => request.value.kind.startsWith("region")}
            fallback={"Custom Pokémon should be..."}
          >
            {() => (
              <>
                Non-{REGIONS.of((request.value as { region: RegionKey }).region).name} Pokémon
                should be...
              </>
            )}
          </Show>
        </div>

        <Select
          active={failure}
          options={() => FAILURE_MODES}
          onChange={(v) => (failure.value = v)}
        />
      </Show>
    </Modal>
  );
}
