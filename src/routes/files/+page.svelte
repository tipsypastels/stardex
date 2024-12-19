<script lang="ts">
  import Export from "$lib/components/files/Export.svelte";
  import Load from "$lib/components/files/Load.svelte";
  import Save from "$lib/components/files/Save.svelte";
  import Layout from "$lib/components/layout/Layout.svelte";
  import Section from "$lib/components/layout/Section.svelte";
</script>

<Layout title="Files">
  <Section id="files_save" title="Save">
    <p class="mb-4">You can export your Stardex state as a JSON file to share it with others.</p>
    <Save />
  </Section>

  <Section id="files_load" title="Load">
    <p class="mb-4">Import Stardex state from a saved JSON file.</p>
    <Load />
  </Section>

  <Section id="files_export" title="Export">
    <p class="mb-4">
      Click the table below to copy it to your clipboard. It can be pasted into Google Sheets with
      formatting intact.
    </p>
    <Export />
  </Section>
</Layout>
