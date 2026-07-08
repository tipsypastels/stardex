import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import { POKEDEX_FORMATS, type PokedexFormat } from "../../../models/pokedex_format";
import { PokedexFormatContext } from "../../../state/context";
import { Actions } from "../../common/actions";
import { ModePicker } from "../../common/mode_picker";
import { Modal } from "../../layout/modal";

export function PokedexActions() {
  const format = useContext(PokedexFormatContext);

  const modal = useSignal<"format">();

  return (
    <>
      <Actions
        actions={[
          {
            icon: format.icon.value,
            name: "Format",
            onClick: () => (modal.value = "format"),
          },
          {
            icon: "asterisk",
            name: "Filter",
            onClick: () => {},
          },
        ]}
      />

      <Show when={() => modal.value === "format"}>
        <FormatModal format={format} onClose={() => (modal.value = undefined)} />
      </Show>
    </>
  );
}

interface FormatModalProps {
  format: PokedexFormat;
  onClose(): void;
}

function FormatModal({ format, onClose }: FormatModalProps) {
  return (
    <Modal title="Pokédex Format" onClose={onClose}>
      <ModePicker
        modes={POKEDEX_FORMATS.options}
        activeIndex={format.index.value}
        setActiveIndex={(index) => (format.key.value = POKEDEX_FORMATS.keys[index])}
      />
    </Modal>
  );
}
