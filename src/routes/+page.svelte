<script lang="ts">
  import Layout from "$lib/components/Layout.svelte";
  import PokemonEmptyCta from "$lib/components/PokemonEmptyCta.svelte";
  import PokemonGrid from "$lib/components/PokemonGrid.svelte";
  import { pokemon } from "$lib/state";
</script>

<Layout title="Pokédex">
  {#if $pokemon.length > 0}
    <PokemonGrid />
  {:else}
    <PokemonEmptyCta />
  {/if}
</Layout>
