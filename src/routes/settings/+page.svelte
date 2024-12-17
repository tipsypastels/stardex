<script lang="ts">
  import IconLink from "$lib/components/IconLink.svelte";
  import Layout from "$lib/components/Layout.svelte";
  import RegionSettings from "$lib/components/RegionSettings.svelte";
  import Section from "$lib/components/Section.svelte";
  import { STATE_STORAGE_KEY } from "$lib/components/StateStorage.svelte";
  import StrictnessSettings from "$lib/components/StrictnessSettings.svelte";
  import TypeName from "$lib/components/TypeName.svelte";
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

  <Section title="Danger Zone">
    <p class="mb-4">
      Clicking this very dangerous looking button will <span class="text-red-500"
        >delete your Pokédex</span
      >, as well as resetting all options to their defaults. It is absolutely, definitively
      <span class="text-red-500">irreversible</span>.
    </p>

    <button
      class="rounded-md bg-red-500 px-4 py-2 font-bold text-white"
      onclick={() => {
        if (confirm("Really? You're sure? You want to lose everything?")) {
          localStorage.removeItem(STATE_STORAGE_KEY);
          location.reload();
        }
      }}>Delete Local Data</button
    >
  </Section>
</Layout>
