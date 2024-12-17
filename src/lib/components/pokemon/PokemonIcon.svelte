<script lang="ts">
  import { isPokemonCustom, type Pokemon } from "$lib/models/pokemon";
  import SpeciesIcon from "./SpeciesIcon.svelte";

  interface Props {
    for: Pokemon;
  }

  let { for: mon }: Props = $props();
</script>

{#if isPokemonCustom(mon)}
  <SpeciesIcon for={{ id: 0, name: mon.name }} />
{:else}
  <SpeciesIcon for={mon.species} />
{/if}
