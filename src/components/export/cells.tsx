import { batch, useComputed } from "@preact/signals";
import { useContext } from "preact/hooks";
import type { Pokemon } from "../../models/pokemon";
import { PokemonsContext } from "../../state/context";
import { toasts } from "../../state/toast";
import { Button } from "../common/button";
import { Modal } from "../common/menus/modal";

export interface ExportCellsModalProps {
  onClose(): void;
}

export function ExportCellsModal({ onClose }: ExportCellsModalProps) {
  const pokemons = useContext(PokemonsContext);

  function makeCell(text: string, color?: string) {
    return `<td style="overflow: hidden; padding: 2px 3px 2px 3px; vertical-align: bottom; ${color ? `background-color: ${color}; color: white;` : ""}">${text}</td>`;
  }

  function makeHtml(pokemons: Iterable<Pokemon>) {
    const out: string[][] = [];

    for (const pokemon of pokemons) {
      out.push([
        makeCell(pokemon.species?.value?.id?.toString() ?? ""),
        makeCell(pokemon.name.value),
        ...pokemon.types.value.map((type) => makeCell(type.name, type.color)),
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

  const html = useComputed(() => makeHtml(pokemons.all.value));

  async function copy() {
    const item = new ClipboardItem({ "text/html": html.value });
    await navigator.clipboard.write([item]);

    batch(() => {
      toasts.add("copy", "Cells copied!");
      onClose();
    });
  }

  return (
    <Modal
      title="Export Cells"
      onClose={onClose}
      footer={
        <div class="flex flex-col justify-center">
          <Button onClick={copy}>Copy to Clipboard</Button>
        </div>
      }
    >
      <div class="relative max-h-60 overflow-x-hidden overflow-y-scroll border-2 border-divider-heavy p-4">
        <div dangerouslySetInnerHTML={{ __html: html.value }}></div>
      </div>
    </Modal>
  );
}
