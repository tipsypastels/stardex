<script lang="ts">
  import { isPokemonCustom, resolvePokemonName, resolvePokemonTypes } from "$lib/models/pokemon";
  import { pokemon } from "$lib/state/pokemon";
  import Icon from "../common/Icon.svelte";

  function makeHtml() {
    let out: string[][] = [];

    function makeCell(text: string, color?: string) {
      return `<td style="overflow: hidden; padding: 2px 3px 2px 3px; vertical-align: bottom; ${color ? `background-color: ${color}; color: white;` : ""}">${text}</td>`;
    }

    for (const mon of $pokemon) {
      const id = isPokemonCustom(mon) ? "" : `${mon.species.id}`;
      const name = resolvePokemonName(mon);
      const types = resolvePokemonTypes(mon);
      out.push([makeCell(id), makeCell(name), ...types.map((t) => makeCell(t.name, t.color))]);
    }

    return `
      ${out
        .map(
          (row) => `
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
        .join("")}
    `;
  }

  let justCopied = $state(false);
  let html = $derived(makeHtml());
  let elem: HTMLDivElement;

  async function copy() {
    elem.focus();
    const item = new ClipboardItem({ "text/html": html });
    await navigator.clipboard.write([item]);
    justCopied = true;
    elem.blur();
  }
</script>

<div class="relative">
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div
    class="overflow-x-scroll border-2 border-slate-300 p-4"
    bind:this={elem}
    contenteditable
    spellcheck="false"
    onclick={copy}
  >
    {@html html}
  </div>

  {#if justCopied}
    <div class="absolute right-4 top-4 rounded-lg bg-lime-600 px-4 py-2 font-bold text-white">
      <Icon name="check" />
      Copied
    </div>
  {/if}
</div>
