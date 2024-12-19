<script lang="ts">
  import { pokemon } from "$lib/state/pokemon";
  import { regions } from "$lib/state/regions";
  import { strictness } from "$lib/state/strictness";

  let saveData = $derived({
    pokemon: $pokemon,
    regions: $regions,
    strictness: $strictness,
  });

  function save() {
    const a = document.createElement("a");
    const content = JSON.stringify(saveData);
    const file = new Blob([content], { type: "application/json" });

    a.href = URL.createObjectURL(file);
    a.download = "stardex.json";
    a.click();

    URL.revokeObjectURL(a.href);
  }

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
    if (
      data.pokemon &&
      ($pokemon.length === 0 ||
        confirm("Overwrite your existing Pokédex? This cannot be reversed."))
    ) {
      pokemon.set(data.pokemon);
    }
  }
</script>

<div class="flex">
  <button class="mr-4 rounded-md bg-lime-600 px-4 py-2 font-bold text-white" onclick={save}
    >Save JSON</button
  >

  <label class="mr-4 cursor-pointer rounded-md bg-slate-300 px-4 py-2 font-bold">
    <input type="file" accept="application/json" class="hidden" onchange={load} />
    Load JSON
  </label>
</div>
