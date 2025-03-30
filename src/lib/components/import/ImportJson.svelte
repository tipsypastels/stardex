<script lang="ts">
  import { goto } from "$app/navigation";
  import { PAGE_LINKS } from "$lib/links";
  import { askBeforeOverwritingMons } from "$lib/models/pokemon";
  import { pokemon } from "$lib/state/pokemon";
  import { regions } from "$lib/state/regions";
  import { strictness } from "$lib/state/strictness";

  async function load(e: { currentTarget: HTMLInputElement }) {
    const files = e.currentTarget.files;
    if (!files || !files.length) {
      alert("Select a file!");
      return;
    }
    const file = files[0];
    const text = await file.text();
    const data = JSON.parse(text);

    if (data.strictness) {
      strictness.set(data.strictness);
    }
    if (data.regions) {
      regions.set(data.regions);
    }
    if (data.pokemon && askBeforeOverwritingMons($pokemon)) {
      pokemon.set(data.pokemon);
    }

    goto(PAGE_LINKS.editor.href);
  }
</script>

<div class="flex">
  <label class="mr-4 cursor-pointer rounded-md bg-lime-600 px-4 py-2 font-bold text-white">
    <input type="file" accept="application/json" class="hidden" onchange={load} />
    Load JSON
  </label>
</div>
