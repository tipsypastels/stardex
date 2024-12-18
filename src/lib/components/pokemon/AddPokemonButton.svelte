<script lang="ts">
  import { addPokemonModalOpen } from "$lib/state/add_pokemon_modal";
</script>

<div class="hidden md:block">
  <button
    class="rounded-md bg-lime-600 px-4 py-2 font-bold text-white transition hover:-translate-y-1 hover:bg-indigo-950 hover:text-lime-600"
    onclick={() => addPokemonModalOpen.set(true)}>Add Pokémon</button
  >
</div>
