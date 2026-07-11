import { batch, useSignal } from "@preact/signals";
import { useContext } from "preact/hooks";
import { type RegionKey, REGIONS } from "../../../models/region";
import { PokemonsContext } from "../../../state/context";
import { toasts } from "../../../state/toast";
import { Button } from "../../common/button";
import { Modal } from "../../common/menus/modal";
import { Select } from "../../common/select";

export interface ImportRegionModalProps {
  onClose(): void;
}

export function ImportRegionModal({ onClose }: ImportRegionModalProps) {
  const pokemons = useContext(PokemonsContext);
  const regionKey = useSignal<RegionKey>("kanto");

  function doImport() {
    batch(() => {
      const region = REGIONS.of(regionKey.value);
      pokemons.setFromRegion(region);
      toasts.push({ text: `Imported ${region.name} Pokédex!`, icon: region.icon });
      onClose();
    });
  }

  return (
    <Modal
      title="Import Region"
      onClose={onClose}
      footer={
        <div class="flex flex-col justify-center">
          <Button onClick={doImport}>Import</Button>
        </div>
      }
    >
      <Select
        active={regionKey}
        options={() => REGIONS.all}
        onChange={(v) => (regionKey.value = v)}
      />
    </Modal>
  );
}
