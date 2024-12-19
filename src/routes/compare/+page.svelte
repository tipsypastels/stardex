<script lang="ts">
  import IconLink from "$lib/components/common/IconLink.svelte";
  import Layout from "$lib/components/layout/Layout.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import TypePieChart from "$lib/components/pokemon/util/TypePieChart.svelte";
  import { pokemonAllotment, regionsAllotment } from "$lib/state/metrics";
  import { regions } from "$lib/state/regions";
</script>

<Layout title="Compare">
  <Section title="Types">
    <TypePieChart allotment={$pokemonAllotment} />
  </Section>

  <Section title="Compared Types">
    {#if $regions.size > 0}
      <TypePieChart allotment={$regionsAllotment} />
    {:else}
      <p>
        Select some regions on the <IconLink to="settings" /> page to use this feature.
      </p>
    {/if}
  </Section>
</Layout>
