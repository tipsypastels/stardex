import { batch, createMemo } from "solid-js";
import { pokemons } from "../../models/pokemon/list";
import { toasts } from "../../models/ui/toast";
import { Button } from "../common/button";
import { Modal } from "../common/menus/modal";

export interface ExportCellsModalProps {
  onClose(): void;
}

export function ExportCellsModal(props: ExportCellsModalProps) {
  function makeCell(text: string, color?: string) {
    return `<td style="overflow: hidden; padding: 2px 3px 2px 3px; vertical-align: bottom; ${color ? `background-color: ${color}; color: white;` : ""}">${text}</td>`;
  }

  function makeHtml() {
    const out: string[][] = [];

    for (const pokemon of pokemons.all) {
      out.push([
        makeCell(pokemon.species?.id?.toString() ?? ""),
        makeCell(pokemon.nameWithAltNameOrNoAltName),
        ...pokemon.types.map((type) => makeCell(type.name, type.color)),
      ]);
    }

    return out
      .map(
        (row) =>
          `
        <table cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout: fixed; font-size: 10pt; font-family: arial,sans,sans-serif; width: 0; border-collapse: collapse; border: none;">
          <colgroup>
            <col width="30">
            <col width="200">
            <col width="100">
            <col width="100">
          </colgroup>

          <tbody>
            <tr style="height: 21px">
              ${row.join("")}
            </tr>
          </tbody>
        </table>
      `,
      )
      .join("");
  }

  const html = createMemo(() => makeHtml());

  async function copy() {
    const item = new ClipboardItem({ "text/html": html() });
    await navigator.clipboard.write([item]);

    batch(() => {
      toasts.add("copy", "Cells copied!");
      props.onClose();
    });
  }

  return (
    <Modal
      title="Export Cells"
      onClose={props.onClose}
      footer={
        <div class="flex flex-col justify-center">
          <Button onClick={copy}>Copy to Clipboard</Button>
        </div>
      }
    >
      <div class="relative max-h-60 overflow-x-hidden overflow-y-scroll border-2 border-divider-heavy p-4">
        {/* eslint-disable-next-line solid/no-innerhtml */}
        <div innerHTML={html()} />
      </div>
    </Modal>
  );
}
