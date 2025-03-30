<script lang="ts">
  import ImportJson from "$lib/components/import/ImportJson.svelte";
  import ImportLegacyPokedex from "$lib/components/import/ImportLegacyPokedex.svelte";
  import Layout from "$lib/components/layout/Layout.svelte";
  import Section from "$lib/components/layout/Section.svelte";
</script>

<Layout title="Files">
  <Section id="import_json" title="JSON">
    <p class="mb-4">You can load a Stardex JSON file that you have previously exported.</p>
    <ImportJson />
  </Section>

  <Section id="export_table" title="Legacy Pokédex Format">
    <p class="mb-4">
      You can import your Pokédex from Stardex version 1, which provided a plain text editor to type
      your Pokémon into instead.
    </p>
    <ImportLegacyPokedex />
  </Section>
</Layout>
