<script lang="ts">
  import Layout from "$lib/components/layout/Layout.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import { pokemonAllotment, recommendations, regionsAllotment } from "$lib/state/metrics";

  function replaceMap(_key: string, value: unknown) {
    if (value instanceof Map) {
      return Object.fromEntries(value.entries());
    }
    return value;
  }
</script>

<Layout title="Breakdown">
  <Section title="Pokémon Allotment">
    <pre>{JSON.stringify($pokemonAllotment, replaceMap, 2)}</pre>
  </Section>

  <Section title="Regions Allotment">
    <pre>{JSON.stringify($regionsAllotment, replaceMap, 2)}</pre>
  </Section>

  <Section title="Recommendations">
    <pre>{JSON.stringify($recommendations, null, 2)}</pre>
  </Section>
</Layout>
