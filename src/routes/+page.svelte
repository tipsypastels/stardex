<script lang="ts">
  import IconLink from "$lib/components/common/IconLink.svelte";
  import Layout from "$lib/components/layout/Layout.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import AddPokemon from "$lib/components/pokemon/add/AddPokemon.svelte";
  import Pokedex from "$lib/components/pokemon/Pokedex.svelte";
  import TypePieChart from "$lib/components/pokemon/util/TypePieChart.svelte";
  import { pokemonAllotment } from "$lib/state/metrics";
  import { regions } from "$lib/state/regions";
</script>

<Layout title="Editor">
  <div class="mb-8 border-b-[1px] border-b-slate-300 pb-8">
    <AddPokemon />
    <Pokedex />
  </div>

  <Section title="Types">
    <TypePieChart allotment={$pokemonAllotment} />
  </Section>

  <Section title="Recommendations">
    {#if $regions.size > 0}
      hi
    {:else}
      <p>
        Select some regions on the <IconLink to="settings" /> page to use this feature.
      </p>
    {/if}
  </Section>
</Layout>
