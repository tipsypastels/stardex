import { createSignal, Show } from "solid-js";
import { globalInterfaceOptions } from "../../models/interface";
import { Checkbox } from "../common/forms/checkbox";
import { Modal } from "../common/menus/modal";

const [open, setOpen] = createSignal(false);

export { setOpen as setInterfaceOpen };

export function InterfaceModal() {
  return (
    <Show when={open()}>
      <Modal title="Layout" onClose={() => setOpen(false)}>
        <Checkbox
          name="Float Recommendations"
          checked={globalInterfaceOptions.pipRecommendations}
          onChange={(checked) => (globalInterfaceOptions.pipRecommendations = checked)}
        />
      </Modal>
    </Show>
  );
}
