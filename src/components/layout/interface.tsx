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
          name={
            <div>
              <div>Floating Recommendations</div>
              <div class="text-base">
                Recommendations will remain on-screen at the bottom right regardless of your scroll
                position.
              </div>
            </div>
          }
          alignTop
          checked={globalInterfaceOptions.pipRecommendations}
          onChange={(checked) => (globalInterfaceOptions.pipRecommendations = checked)}
        />
      </Modal>
    </Show>
  );
}
