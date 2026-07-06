<script lang="ts">
  import { pokemons } from "$lib/state/pokemons";
  import Icon from "../common/Icon.svelte";

  function makeHtml() {
    let out: string[][] = [];

    function makeCell(text: string, color?: string) {
      return `<td style="overflow: hidden; padding: 2px 3px 2px 3px; vertical-align: bottom; ${color ? `background-color: ${color}; color: white;` : ""}">${text}</td>`;
    }

    for (const pokemon of $pokemons) {
      const id = pokemon.isCustom() ? "" : `${pokemon.species.id}`;
      out.push([makeCell(id), makeCell(pokemon.name), ...pokemon.types.map((t) => makeCell(t.name, t.color))]);
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
    const item = new ClipboardItem({ "text/html": html });
    await navigator.clipboard.write([item]);
    justCopied = true;
  }
</script>

<div class="relative">
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div
    class="cursor-pointer overflow-x-scroll border-2 border-slate-300 p-4"
    bind:this={elem}
    onclick={copy}
  >
    {@html html}
  </div>

  {#if justCopied}
    <div class="absolute top-4 right-4 rounded-lg bg-lime-600 px-4 py-2 font-bold text-white">
      <Icon name="check" />
      Copied
    </div>
  {/if}
</div>
