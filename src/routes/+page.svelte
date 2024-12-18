<script lang="ts">
  import Layout from "$lib/components/layout/Layout.svelte";
  import AddPokemon from "$lib/components/pokemon/add/AddPokemon.svelte";
  import Pokedex from "$lib/components/pokemon/Pokedex.svelte";
</script>

<Layout title="Pokédex">
  <AddPokemon />
  <Pokedex />
</Layout>

<button onclick={() => localStorage.removeItem("stardex_pokemon")}>Clear Dex</button>
