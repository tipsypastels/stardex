<script lang="ts">
  import Layout from "$lib/components/layout/Layout.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import TypePieChart from "$lib/components/pokemon/util/TypePieChart.svelte";
  import { pokemonAllotment, recommendations, regionsAllotment } from "$lib/state/metrics";
</script>

<Layout title="Breakdown">
  <Section title="Types">
    <TypePieChart allotment={$pokemonAllotment} />
  </Section>

  <Section title="Recommendations">
    <pre>{JSON.stringify($recommendations, null, 2)}</pre>
  </Section>
</Layout>
