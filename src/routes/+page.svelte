<script lang="ts">
  import Layout from "$lib/components/Layout.svelte";
  import Section from "$lib/components/Section.svelte";
  import StateView from "$lib/components/StateView.svelte";
  import PokemonGrid from "$lib/components/PokemonGrid.svelte";
</script>

<Layout title="Overview">
  <Section title="Pokédex">
    <PokemonGrid />
  </Section>

  <Section title="Debug">
    <StateView />
  </Section>
</Layout>
