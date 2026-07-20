import { createMemo, createSignal, Match, Show, Switch } from "solid-js";
import type { AutosortFailureMode, AutosortRequest } from "../../../models/pokemon/autosort";
import { REGIONS, type RegionKey } from "../../../models/region";
import { Button } from "../../common/button";
import { Select } from "../../common/forms/select";
import { Modal } from "../../common/menus/modal";

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

export function AutosortPokedexModal(props: AutosortPokedexModalProps) {
  const [kind, setKind] = createSignal<AutosortRequest["kind"]>("id");
  const [region, setRegion] = createSignal<RegionKey>("kanto");
  const [failure, setFailure] = createSignal<AutosortFailureMode>("end");

  const request = createMemo((): AutosortRequest => {
    switch (kind()) {
      case "id": {
        return { kind: "id", failure: failure() };
      }
      case "region": {
        return { kind: "region", failure: failure(), region: REGIONS.of(region()) };
      }
      case "types": {
        return { kind: "types" };
      }
    }
  });

  return (
    <Modal
      title="Sort Pokédex"
      onClose={props.onClose}
      footer={
        <div class="flex flex-col justify-center">
          <Button onClick={() => props.onAutosort(request())}>Sort</Button>
        </div>
      }
    >
      <Select active={kind()} options={KINDS} onChange={(kind) => setKind(kind)} />

      <Switch>
        <Match when={kind() === "id"}>
          <div class="py-2 text-center text-sm">Custom Pokémon should be...</div>
        </Match>

        <Match when={kind() === "region"}>
          <div class="mt-2">
            <Select
              active={region()}
              options={REGIONS.all}
              onChange={(region) => setRegion(region)}
            />
          </div>
          <div class="py-2 text-center text-sm">
            Non-{REGIONS.of(region()).name} Pokémon should be...
          </div>
        </Match>
      </Switch>

      <Show when={kind() !== "types"}>
        <Select
          active={failure()}
          options={FAILURE_MODES}
          onChange={(failure) => setFailure(failure)}
        />
      </Show>

      <div class="mt-2 text-center text-sm">
        <strong class="text-warning">Warning:</strong> Sorting isn't automatically reversible.
      </div>
    </Modal>
  );
}

export function toastDescriptionOfAutosortRequest(request: AutosortRequest) {
  switch (request.kind) {
    case "id": {
      return "national dex number";
    }
    case "region": {
      return `${request.region.name} dex number`;
    }
    case "types": {
      return "types";
    }
  }
}
