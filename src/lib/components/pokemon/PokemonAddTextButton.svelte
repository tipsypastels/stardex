<script lang="ts">
  import { setEditorOpen } from "$lib/state";
</script>

<div class="hidden md:block">
  <button
    class="rounded-md bg-lime-600 px-4 py-2 font-bold text-white transition hover:-translate-y-1 hover:bg-indigo-950 hover:text-lime-600"
    onclick={() => setEditorOpen(true)}>Add Pokémon</button
  >
</div>
