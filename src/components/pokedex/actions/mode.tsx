import { POKEDEX_MODES, pokedexMode } from "../../../models/pokedex/mode";
import { Modal } from "../../common/menus/modal";
import { ModePicker } from "../../common/menus/mode_picker";

export interface PokedexModeModalProps {
  onClose(): void;
}

export function PokedexModeModal(props: PokedexModeModalProps) {
  return (
    <Modal title="Pokédex Mode" onClose={props.onClose}>
      <ModePicker
        modes={POKEDEX_MODES.options}
        activeIndex={pokedexMode.index}
        setActiveIndex={(index) => (pokedexMode.key = POKEDEX_MODES.keys[index])}
      />
    </Modal>
  );
}
