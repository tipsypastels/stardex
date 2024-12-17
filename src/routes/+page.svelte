<script lang="ts">
  import Layout from "$lib/components/layout/Layout.svelte";
  import PokemonEmptyCta from "$lib/components/pokemon/PokemonEmptyCta.svelte";
  import PokemonGrid from "$lib/components/pokemon/PokemonGrid.svelte";
  import { pokemon } from "$lib/state/pokemon";
</script>

<Layout title="Pokédex">
  {#if $pokemon.length > 0}
    <PokemonGrid />
  {:else}
    <PokemonEmptyCta />
  {/if}
</Layout>
