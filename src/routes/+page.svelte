<script lang="ts">
  import Layout from "$lib/components/layout/Layout.svelte";
  import PokedexEmptyCta from "$lib/components/pokemon/PokedexEmptyCta.svelte";
  import Pokedex from "$lib/components/pokemon/Pokedex.svelte";
  import { pokemon } from "$lib/state/pokemon";
</script>

<Layout title="Pokédex">
  {#if $pokemon.length > 0}
    <Pokedex />
  {:else}
    <PokedexEmptyCta />
  {/if}
</Layout>
