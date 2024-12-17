<script lang="ts">
  import { addPokemonModalOpen } from "$lib/state/add_pokemon_modal";
</script>

<button
  class="flex h-[400px] w-full items-center justify-center border-4 border-dashed border-slate-300"
  onclick={() => addPokemonModalOpen.set(true)}
>
  <div>You have no Pokémon yet! Add some!</div>
</button>
