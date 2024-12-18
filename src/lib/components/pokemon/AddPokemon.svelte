<script lang="ts">
  import { addPokemonModalOpen } from "$lib/state/add_pokemon_modal";
  import Modal from "../layout/Modal.svelte";
  import AddPokemonBuiltin from "./AddPokemonBuiltin.svelte";
  import AddPokemonCustom from "./AddPokemonCustom.svelte";

  let query = $state("");
  let customMonName = $state<string | undefined>();

  function onclose() {
    addPokemonModalOpen.set(false);
  }
</script>

<Modal open={$addPokemonModalOpen} {onclose}>
  {#snippet title()}
    Add Pokémon
  {/snippet}

  <!-- svelte-ignore a11y_autofocus -->
  <input class="mb-4 block w-full" autofocus disabled={!!customMonName} bind:value={query} />

  {#if customMonName}
    <AddPokemonCustom />
  {:else}
    <AddPokemonBuiltin bind:query {onclose} />
  {/if}
</Modal>
