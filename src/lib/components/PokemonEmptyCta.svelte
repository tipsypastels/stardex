<script lang="ts">
  import { setEditorOpen } from "$lib/state";
</script>

<button
  class="flex h-[400px] w-full items-center justify-center border-4 border-dashed border-slate-300"
  onclick={() => setEditorOpen(true)}
>
  <div>You have no Pokémon yet! Add some!</div>
</button>
