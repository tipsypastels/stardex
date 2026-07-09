import { POKEDEX_FORMATS, type PokedexFormat } from "../../../models/pokedex_format";
import { Modal } from "../../common/menus/modal";
import { ModePicker } from "../../common/menus/mode_picker";

export interface FormatPokedexModalProps {
  format: PokedexFormat;
  onClose(): void;
}

export function FormatPokedexModal({ format, onClose }: FormatPokedexModalProps) {
  return (
    <Modal title="Format Pokédex" onClose={onClose}>
      <ModePicker
        modes={POKEDEX_FORMATS.options}
        activeIndex={format.index.value}
        setActiveIndex={(index) => (format.key.value = POKEDEX_FORMATS.keys[index])}
      />
    </Modal>
  );
}
