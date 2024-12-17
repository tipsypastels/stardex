<script lang="ts">
  import Layout from "$lib/components/Layout.svelte";
  import SpeciesIcon from "$lib/components/SpeciesIcon.svelte";
  import Section from "$lib/components/Section.svelte";
  import StateView from "$lib/components/StateView.svelte";
  import { pokemon } from "$lib/state";
</script>

<Layout title="Overview">
  <Section title="Pokédex">
    <div class="flex">
      {#each $pokemon as mon}
        <SpeciesIcon for={mon.species} />
      {/each}
    </div>
  </Section>

  <Section title="Debug">
    <StateView />
  </Section>
</Layout>
