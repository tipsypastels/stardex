<script lang="ts">
  import ImportJson from "$lib/components/import/ImportJson.svelte";
  import Layout from "$lib/components/layout/Layout.svelte";
  import Section from "$lib/components/layout/Section.svelte";
</script>

<Layout title="Import">
  <Section id="import_json" title="JSON">
    <p class="mb-4">You can load a Stardex JSON file that you have previously exported.</p>
    <ImportJson />
  </Section>

  <Section id="import_legacy" title="Legacy Stardex Data">
    <p class="mb-4 line-through">
      You can import your Pokédex from Stardex version 1, which provided a plain text editor to type
      your Pokémon into instead.
    </p>
    <p class="mb-4">
      <strong>This feature has been removed</strong>, because Stardex now supports a text editor
      mode for everything, not just importing! Choose it in settings and then switch back to the
      editor to use it.
    </p>
  </Section>
</Layout>
