<script lang="ts">
  import Modal from "$lib/components/layout/Modal.svelte";
  import type { Pokemon } from "$lib/models/pokemon";
  import { pokemons } from "$lib/state/pokemons";
  import type { Readable } from "svelte/store";
  import EditPokemon from "./EditPokemon.svelte";

  interface Props {
    index: number | undefined;
    pokemon: Readable<Pokemon> | undefined;
    close(): void;
  }

  let { index, pokemon, close }: Props = $props();

  function deletePokemon() {
    if (index != null) pokemons.delete(index);
    close();
  }
</script>

{#if index != null && pokemon}
  <Modal {close}>
    {#snippet title()}
      Edit {pokemon ? $pokemon!.name : ""}
    {/snippet}
    {#snippet footer()}
      <section class="flex justify-end gap-2">
        <button class="text-red-500 underline" onclick={deletePokemon}>Remove</button>
        <button class="text-lime-600 underline" onclick={close}>Close</button>
      </section>
    {/snippet}
    <EditPokemon {index} {pokemon} />
  </Modal>
{/if}
