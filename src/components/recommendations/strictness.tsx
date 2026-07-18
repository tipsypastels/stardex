import { strictness, STRICTNESSES } from "../../models/strictness";
import { Modal } from "../common/menus/modal";
import { ModePicker } from "../common/menus/mode_picker";

export interface StrictnessModalProps {
  onClose(): void;
}

export function StrictnessModal(props: StrictnessModalProps) {
  return (
    <Modal title="Strictness" onClose={props.onClose}>
      <ModePicker
        modes={STRICTNESSES.options}
        activeIndex={strictness.index}
        setActiveIndex={(index) => (strictness.key = STRICTNESSES.keys[index])}
      />
      <div class="text-sm">
        <strong>Tip:</strong> Strictness controls how much Stardex expects you to adhere to the type
        distributions in the regions you've chosen to compare against.
      </div>
    </Modal>
  );
}
