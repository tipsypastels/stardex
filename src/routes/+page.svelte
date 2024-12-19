<script lang="ts">
  import IconLink from "$lib/components/common/IconLink.svelte";
  import Layout from "$lib/components/layout/Layout.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import AddPokemon from "$lib/components/pokemon/add/AddPokemon.svelte";
  import Pokedex from "$lib/components/pokemon/Pokedex.svelte";
  import Recommendations from "$lib/components/pokemon/Recommendations.svelte";
  import TypePieChart from "$lib/components/pokemon/util/TypePieChart.svelte";
  import { pokemonAllotment } from "$lib/state/metrics";
  import { regions } from "$lib/state/regions";
</script>

<Layout title="Editor">
  <Section id="editor_pokedex" title="Pokedex">
    <AddPokemon />
    <Pokedex />
  </Section>

  <Section id="editor_types" title="Types">
    <TypePieChart allotment={$pokemonAllotment} />
  </Section>

  <Section id="editor_recs" title="Recommendations">
    {#if $regions.size > 0}
      <Recommendations />
    {:else}
      <p>
        Select some regions on the <IconLink to="settings" /> page to use this feature.
      </p>
    {/if}
  </Section>
</Layout>
