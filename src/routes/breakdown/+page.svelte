<script lang="ts">
  import IconLink from "$lib/components/common/IconLink.svelte";
  import Layout from "$lib/components/layout/Layout.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import TypePieChart from "$lib/components/pokemon/util/TypePieChart.svelte";
  import { pokemonAllotment, recommendations } from "$lib/state/metrics";
  import { regions } from "$lib/state/regions";
</script>

<Layout title="Breakdown">
  <Section title="Types">
    <TypePieChart allotment={$pokemonAllotment} />
  </Section>

  <Section title="Recommendations">
    {#if $regions.size > 0}
      <pre>{JSON.stringify($recommendations, null, 2)}</pre>
    {:else}
      <p>
        Select some regions on the <IconLink to="settings" /> page to use this feature.
      </p>
    {/if}
  </Section>
</Layout>
