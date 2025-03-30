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
</script>

<div class="flex">
  <button class="mr-4 rounded-md bg-lime-600 px-4 py-2 font-bold text-white" onclick={save}
    >Save JSON</button
  >
</div>
