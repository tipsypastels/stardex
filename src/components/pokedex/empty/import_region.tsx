import { batch, createSignal } from "solid-js";
import { pokemons } from "../../../models/pokemon/list";
import { type RegionKey, REGIONS } from "../../../models/region";
import { toasts } from "../../../models/ui/toast";
import { Button } from "../../common/button";
import { Select } from "../../common/forms/select";
import { Modal } from "../../common/menus/modal";

export interface ImportRegionModalProps {
  onClose(): void;
}

export function ImportRegionModal(props: ImportRegionModalProps) {
  const [regionKey, setRegionKey] = createSignal<RegionKey>("kanto");

  function doImport() {
    batch(() => {
      const region = REGIONS.of(regionKey());
      pokemons.setFromRegion(region);
      toasts.add(region.icon, `Imported ${region.name} Pokédex!`);
      props.onClose();
    });
  }

  return (
    <Modal
      title="Import Region"
      onClose={props.onClose}
      footer={
        <div class="flex flex-col justify-center">
          <Button onClick={doImport}>Import</Button>
        </div>
      }
    >
      <Select active={regionKey()} options={REGIONS.all} onChange={setRegionKey} />
    </Modal>
  );
}
