<script lang="ts">
  import Layout from "$lib/components/layout/Layout.svelte";
  import RegionSettings from "$lib/components/settings/RegionSettings.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import StrictnessSettings from "$lib/components/settings/StrictnessSettings.svelte";
  import PokedexFormatSettings from "$lib/components/settings/PokedexFormatSettings.svelte";
  import TypeName from "$lib/components/common/TypeName.svelte";
  import { pokemon } from "$lib/state/pokemon";
  import { goto } from "$app/navigation";
  import { PAGE_LINKS } from "$lib/links";
</script>

<Layout title="Settings">
  <Section id="settings_regions" title="Regions">
    <p class="mb-4">
      Controls which regions will be used as the basis of the recommendations list. The average
      distribution of types (for example, what percentage of Pokémon are <TypeName for="fire" /> type)
      will be used to inform recommendations.
    </p>

    <RegionSettings />
  </Section>

  <Section id="settings_strictness" title="Strictness">
    <p>
      Controls how much Stardex expects you to adhere to the type distributions in the regions
      you've chosen to compare against.
    </p>

    <StrictnessSettings />
  </Section>

  <Section id="settings_pokedex_format" title="Pokédex Format">
    <p>Controls how Pokémon appear in the Editor page's Pokédex.</p>
    <PokedexFormatSettings />
  </Section>

  <Section id="settings_delete_pokedex" title="Danger Zone">
    <p class="mb-4">
      Clicking this very dangerous looking button will <span class="text-red-500"
        >delete your Pokédex</span
      >. It is absolutely, definitively
      <span class="text-red-500">irreversible</span>.
    </p>
    <button
      class="rounded-md bg-red-500 px-4 py-2 font-bold text-white"
      onclick={() => {
        if (confirm("Really? You're sure? You want to lose everything?")) {
          pokemon.clear();
          goto(PAGE_LINKS.editor.href);
        }
      }}>Delete My Pokédex</button
    >
  </Section>
</Layout>
