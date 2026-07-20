import { createSignal, Show } from "solid-js";
import { saveJSONExport, saveTextExport } from "../../models/export";
import { pokemons } from "../../models/pokemon/list";
import { Button } from "../common/button";
import { Empty } from "../common/empty";
import { LinedSubheading } from "../common/heading";
import { Icon } from "../common/icon";
import { ButtonLink } from "../common/link";
import { Modal } from "../common/menus/modal";
import { Section } from "../layout/section";
import { ExportCellsModal } from "./cells";

export function Export() {
  const [modal, setModal] = createSignal<"cells" | "help">();

  return (
    <Section id="export" title="Export">
      <Show
        when={() => pokemons.all.length > 0}
        fallback={<Empty>Don't make me say it again!</Empty>}
      >
        <div class="mb-4 flex gap-2">
          <Button onClick={saveJSONExport}>As JSON</Button>
          <Button onClick={saveTextExport}>As Text File</Button>
          <Button onClick={() => setModal("cells")}>As Spreadsheet Cells</Button>
        </div>

        <div>
          <ButtonLink onClick={() => setModal("help")}>Help me choose!</ButtonLink>
        </div>
      </Show>

      <Show when={modal() === "cells"}>
        <ExportCellsModal onClose={() => setModal(undefined)} />
      </Show>

      <Show when={modal() === "help"}>
        <Modal title="Export Help" onClose={() => setModal(undefined)}>
          <p class="mb-4">Stardex has multiple ways to export your project.</p>
          <div class="text-base">
            <div class="mb-4">
              <LinedSubheading>As JSON</LinedSubheading>
              <p class="mb-2">
                This exports Stardex's internal state for the current project. Though it's text,
                it's not intended to be human readable. It includes project-specific settings like
                compared regions and custom icons.
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
                text editor mode. Other settings like regions and custom icons are not included.
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
