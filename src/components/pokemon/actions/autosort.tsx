import { useSignal } from "@preact/signals";
import type {
  AutosortMismatchPlacement,
  AutosortMode,
  AutosortOptions,
} from "../../../models/pokemon/autosort";
import { REGIONS } from "../../../models/region";
import { Button } from "../../common/button";
import { Modal } from "../../common/menus/modal";
import { Select } from "../../common/select";

export interface AutosortPokedexModalProps {
  onAutosort(options: AutosortOptions): void;
  onClose(): void;
}

const MODES: { id: AutosortMode; name: string }[] = [
  { id: "national", name: "By National Dex Number" },
  ...REGIONS.all.map((region) => ({
    id: region.key,
    name: `By ${region.name} Dex Number`,
  })),
];

const MISMATCH_PLACEMENTS: { id: AutosortMismatchPlacement; name: string }[] = [
  { id: "end", name: "Moved to the end" },
  { id: "start", name: "Moved to the start" },
  { id: "remove", name: "Removed from the Dex" },
];

export function AutosortPokedexModal({ onAutosort, onClose }: AutosortPokedexModalProps) {
  const mode = useSignal<AutosortMode>("national");
  const mismatchPlacement = useSignal<AutosortMismatchPlacement>("end");

  return (
    <Modal
      title="Autosort Pokédex"
      onClose={onClose}
      footer={
        <div class="flex flex-col justify-center">
          <Button
            onClick={() =>
              onAutosort({ mode: mode.value, mismatchPlacement: mismatchPlacement.value })
            }
          >
            Autosort
          </Button>
        </div>
      }
    >
      <Select active={mode} options={() => MODES} onChange={(v) => (mode.value = v)} />

      <div class="py-2 text-center text-sm">Pokémon not matching should be...</div>

      <Select
        active={mismatchPlacement}
        options={() => MISMATCH_PLACEMENTS}
        onChange={(v) => (mismatchPlacement.value = v)}
      />
    </Modal>
  );
}
