<script lang="ts">
  import { base } from "$app/paths";
  import IconLink from "$lib/components/common/IconLink.svelte";
  import Layout from "$lib/components/layout/Layout.svelte";
  import RegionSettings from "$lib/components/settings/RegionSettings.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import StrictnessSettings from "$lib/components/settings/StrictnessSettings.svelte";
  import TypeName from "$lib/components/common/TypeName.svelte";
</script>

<Layout title="Settings">
  <Section title="Regions">
    <p class="mb-4">
      Controls which regions will be used as the basis of the <IconLink to="compare" /> page. The average
      distribution of types (for example, what percentage of Pokémon are <TypeName for="fire" /> type)
      will be used to inform recommendations.
    </p>

    <RegionSettings />
  </Section>

  <Section title="Strictness">
    <p>
      Controls how much Stardex expects you to adhere to the type distributions in the regions
      you've chosen to compare against.
    </p>

    <StrictnessSettings />
  </Section>
</Layout>
