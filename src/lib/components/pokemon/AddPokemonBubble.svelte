<script lang="ts">
  import Icon from "../common/Icon.svelte";
  import { addPokemonModalOpen } from "$lib/state/add_pokemon_modal";
</script>

<button
  class="fixed bottom-6 right-6 z-10 flex h-[65px] w-[65px] items-center justify-center rounded-full bg-lime-600 text-2xl text-white shadow-lg shadow-slate-400 md:hidden"
  onclick={() => addPokemonModalOpen.set(true)}
  aria-label="Add Pokémon"
>
  <Icon name="plus" />
</button>
