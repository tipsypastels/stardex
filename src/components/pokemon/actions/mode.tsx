import { POKEDEX_MODES, type PokedexMode } from "../../../models/pokedex/mode";
import { Modal } from "../../common/menus/modal";
import { ModePicker } from "../../common/menus/mode_picker";

export interface PokedexModeModalProps {
  mode: PokedexMode;
  onClose(): void;
}

export function PokedexModeModal({ mode, onClose }: PokedexModeModalProps) {
  return (
    <Modal title="Pokédex Mode" onClose={onClose}>
      <ModePicker
        modes={POKEDEX_MODES.options}
        activeIndex={mode.index.value}
        setActiveIndex={(index) => (mode.key.value = POKEDEX_MODES.keys[index])}
      />
    </Modal>
  );
}
