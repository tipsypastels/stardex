<script lang="ts">
  import Layout from "$lib/components/Layout.svelte";
  import Section from "$lib/components/Section.svelte";
  import StateView from "$lib/components/StateView.svelte";
  import DraggablePokemonGrid from "$lib/components/DraggablePokemonGrid.svelte";
</script>

<Layout title="Overview">
  <Section title="Pokédex">
    <DraggablePokemonGrid />
  </Section>

  <Section title="Debug">
    <StateView />
  </Section>
</Layout>
