<script lang="ts">
  import Modal from "$lib/components/layout/Modal.svelte";
  import { resolvePokemonName, type Pokemon } from "$lib/models/pokemon";
  import EditPokemon from "./EditPokemon.svelte";

  interface Props {
    index: number | undefined;
    mon: Pokemon | undefined;
    close(): void;
  }

  let { index, mon, close }: Props = $props();
</script>

<Modal open={index != null} onclose={close}>
  {#snippet title()}
    Editing Pokémon '{resolvePokemonName(mon!)}'
  {/snippet}
  <EditPokemon index={index!} mon={mon!} {close} />
</Modal>
