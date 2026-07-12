import { STRICTNESSES, type Strictness } from "../../models/strictness";
import { Modal } from "../common/menus/modal";
import { ModePicker } from "../common/menus/mode_picker";

export interface StrictnessModalProps {
  strictness: Strictness;
  onClose(): void;
}

export function StrictnessModal({ strictness, onClose }: StrictnessModalProps) {
  return (
    <Modal title="Strictness" onClose={onClose}>
      <ModePicker
        modes={STRICTNESSES.options}
        activeIndex={strictness.index.value}
        setActiveIndex={(index) => (strictness.key.value = STRICTNESSES.keys[index])}
      />
      <div class="text-sm">
        <strong>Tip:</strong> Strictness controls how much Stardex expects you to adhere to the type
        distributions in the regions you've chosen to compare against.
      </div>
    </Modal>
  );
}
