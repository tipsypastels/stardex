import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import { PokemonsContext } from "../../state/context";
import { Button } from "../common/button";
import { Empty } from "../common/empty";
import { LinedSubheading } from "../common/lined_subheading";
import { ButtonLink } from "../common/link";
import { Modal } from "../common/menus/modal";
import { Section } from "../layout/section";

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
          <Button onClick={() => {}}>As Text</Button>
          <Button onClick={() => {}}>As Spreadsheet Cells</Button>
        </div>

        <div>
          <ButtonLink onClick={() => (modal.value = "help")}>Help me choose!</ButtonLink>
        </div>
      </Show>

      <Show when={() => modal.value === "help"}>
        <Modal title="Export Help" onClose={() => (modal.value = undefined)}>
          <p class="mb-4">Stardex has multiple ways to export your project.</p>

          <div class="mb-4">
            <LinedSubheading>As JSON</LinedSubheading>
            <p>
              This exports Stardex's internal state for the current project. Though it's text, it's
              not intended to be human readable. It includes project-specific settings like compared
              regions and strictness.
            </p>
            <p class="mt-2 font-bold">
              If you just want to share a project between people or devices, this is easiest.
            </p>
          </div>

          <div class="mb-4">
            <LinedSubheading>As Text</LinedSubheading>
            <p>
              This exports your Pokédex as a list of names. It's exactly the same format used in the
              text editor mode. Other settings like regions and strictness are not included.
            </p>
          </div>

          <div class="mb-4">
            <LinedSubheading>As Spreadsheet Cells</LinedSubheading>
            <p>This converts your Pokédex into cells pasteable into Google Sheets.</p>
          </div>
        </Modal>
      </Show>
    </Section>
  );
}
