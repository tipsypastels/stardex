<script lang="ts">
  import ExportJson from "$lib/components/export/ExportJson.svelte";
  import ExportTable from "$lib/components/export/ExportTable.svelte";
  import Layout from "$lib/components/layout/Layout.svelte";
  import Section from "$lib/components/layout/Section.svelte";
</script>

<Layout title="Files">
  <Section id="export_json" title="JSON">
    <p class="mb-4">You can export your Stardex state as a JSON file to share it with others.</p>
    <ExportJson />
  </Section>

  <Section id="export_table" title="Table">
    <p class="mb-4">
      Click the table below to copy it to your clipboard. It can be pasted into Google Sheets with
      formatting intact.
    </p>
    <ExportTable />
  </Section>
</Layout>
