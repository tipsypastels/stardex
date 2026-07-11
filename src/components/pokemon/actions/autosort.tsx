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

const KINDS: { key: AutosortRequest["kind"]; name: string }[] = [
  { key: "id", name: "By National Dex Number" },
  { key: "region", name: "By Regional Dex Number" },
  { key: "types", name: "By Types" },
];

const FAILURE_MODES: { key: AutosortFailureMode; name: string }[] = [
  { key: "end", name: "Moved to the end" },
  { key: "start", name: "Moved to the start" },
  { key: "remove", name: "Removed from the dex" },
];

export function AutosortPokedexModal({ onAutosort, onClose }: AutosortPokedexModalProps) {
  const kind = useSignal<AutosortRequest["kind"]>("id");
  const region = useSignal<RegionKey>("kanto");
  const failure = useSignal<AutosortFailureMode>("end");

  const request = useComputed((): AutosortRequest => {
    switch (kind.value) {
      case "id": {
        return { kind: "id", failure: failure.value };
      }
      case "region": {
        return { kind: "region", failure: failure.value, region: region.value };
      }
      case "types": {
        return { kind: "types" };
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
      <Select active={kind} options={() => KINDS} onChange={(v) => (kind.value = v)} />

      <Show when={() => kind.value === "id"}>
        <div class="py-2 text-center text-sm">Custom Pokémon should be...</div>
      </Show>

      <Show when={() => kind.value === "region"}>
        <div class="mt-2">
          <Select
            active={region}
            options={() => REGIONS.all}
            onChange={(v) => (region.value = v)}
          />
        </div>
        <div class="py-2 text-center text-sm">
          Non-{REGIONS.of(region.value).name} Pokémon should be...
        </div>
      </Show>

      <Show when={() => kind.value !== "types"}>
        <Select
          active={failure}
          options={() => FAILURE_MODES}
          onChange={(v) => (failure.value = v)}
        />
      </Show>
    </Modal>
  );
}

export function toastDescriptionOfAutosortRequest(request: AutosortRequest) {
  switch (request.kind) {
    case "id": {
      return "national dex number";
    }
    case "region": {
      return `${request.region} dex number`;
    }
    case "types": {
      return "types";
    }
  }
}
