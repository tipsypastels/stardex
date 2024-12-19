<script lang="ts">
  import Modal from "$lib/components/layout/Modal.svelte";
  import { resolvePokemonName, type Pokemon } from "$lib/models/pokemon";
  import { pokemon } from "$lib/state/pokemon";
  import EditPokemon from "./EditPokemon.svelte";

  interface Props {
    index: number | undefined;
    mon: Pokemon | undefined;
    close(): void;
  }

  let { index, mon, close }: Props = $props();

  function removeMon() {
    if (index != null) pokemon.remove(index);
    close();
  }
</script>

{#if index != null && mon}
  <Modal {close}>
    {#snippet title()}
      Edit {mon ? resolvePokemonName(mon) : ""}
    {/snippet}
    {#snippet footer()}
      <section class="flex justify-end gap-2">
        <button class="text-red-500 underline" onclick={removeMon}>Remove</button>
        <button class="text-lime-600 underline" onclick={close}>Close</button>
      </section>
    {/snippet}
    <EditPokemon {index} {mon} {close} />
  </Modal>
{/if}
