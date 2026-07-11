import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import { PokemonsContext } from "../../state/context";
import { Button } from "../common/button";
import { Empty } from "../common/empty";
import { Icon } from "../common/icon";
import { LinedSubheading } from "../common/lined_subheading";
import { ButtonLink } from "../common/link";
import { Modal } from "../common/menus/modal";
import { Section } from "../layout/section";
import { ExportCellsModal } from "./cells";

export function Export() {
  const pokemons = useContext(PokemonsContext);
  const modal = useSignal<"cells" | "help">();

  return (
    <Section id="export" title="Export" hotkey="jumpToExport">
      <Show
        when={() => pokemons.size.value > 0}
        fallback={<Empty>Don't make me say it again!</Empty>}
      >
        <div class="mb-4 flex gap-2">
          <Button onClick={() => {}}>As JSON</Button>
          <Button onClick={() => {}}>As Text File</Button>
          <Button onClick={() => (modal.value = "cells")}>As Spreadsheet Cells</Button>
        </div>

        <div>
          <ButtonLink onClick={() => (modal.value = "help")}>Help me choose!</ButtonLink>
        </div>
      </Show>

      <Show when={() => modal.value === "cells"}>
        <ExportCellsModal onClose={() => (modal.value = undefined)} />
      </Show>

      <Show when={() => modal.value === "help"}>
        <Modal title="Export Help" onClose={() => (modal.value = undefined)} large>
          <p class="mb-4">Stardex has multiple ways to export your project.</p>
          <div class="text-base">
            <div class="mb-4">
              <LinedSubheading>As JSON</LinedSubheading>
              <p class="mb-2">
                This exports Stardex's internal state for the current project. Though it's text,
                it's not intended to be human readable. It includes project-specific settings like
                compared regions and strictness.
              </p>
              <p class="mb-2">
                If you just want to share a project between people or devices, this is easiest.
              </p>
              <p class="text-sm font-bold text-primary">
                <Icon name="check" /> Importable
              </p>
            </div>

            <div class="mb-4">
              <LinedSubheading>As Text File</LinedSubheading>
              <p class="mb-2">
                This exports your Pokédex as a text file. It's exactly the same format used in the
                text editor mode. Other settings like regions and strictness are not included.
              </p>
              <p class="text-sm font-bold text-primary">
                <Icon name="check" /> Importable
              </p>
            </div>

            <div>
              <LinedSubheading>As Spreadsheet Cells</LinedSubheading>
              <p class="mb-2">
                This creates cells from your Pokédex that you can paste into Google Sheets.
              </p>
              <p class="text-sm font-bold text-error">
                <Icon name="times" /> Not Importable
              </p>
            </div>
          </div>
        </Modal>
      </Show>
    </Section>
  );
}
