<script lang="ts">
  import { editorOpen, pokemon, regions, strictness } from "$lib/state";
  import { STATE_STORAGE_KEY } from "./StateStorage.svelte";

  let fullState = $derived({
    pokemon: $pokemon,
    regions: $regions,
    strictness: $strictness,
    editorOpen: $editorOpen,
  });
</script>

<pre class="overflow-x-scroll">{JSON.stringify(fullState, null, 2)}</pre>

<button
  class="rounded-md bg-red-500 px-4 py-2 font-bold text-white"
  onclick={() => {
    localStorage.removeItem(STATE_STORAGE_KEY);
    location.reload();
  }}>Clear Local Storage</button
>
