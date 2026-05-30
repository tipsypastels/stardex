<script lang="ts">
  import IconLink from "$lib/components/common/IconLink.svelte";
  import Layout from "$lib/components/layout/Layout.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import LegacyTextEditor from "$lib/components/pokemon/legacy/LegacyTextEditor.svelte";
  import AddPokemon from "$lib/components/pokemon/add/AddPokemon.svelte";
  import Pokedex from "$lib/components/pokemon/Pokedex.svelte";
  import Recommendations from "$lib/components/pokemon/Recommendations.svelte";
  import TypePieChart from "$lib/components/pokemon/util/TypePieChart.svelte";
  import { pokemonAllotment } from "$lib/state/metrics";
  import { pokedexFormat } from "$lib/state/pokedex_format";
  import { pokemon } from "$lib/state/pokemon";
  import { regions } from "$lib/state/regions";
</script>

<Layout title="Editor">
  <Section id="editor_pokedex" title={`Pokédex (${$pokemon.length})`}>
    {#if $pokedexFormat === "legacyText"}
      <LegacyTextEditor />
    {:else}
      <AddPokemon />
      <Pokedex />
    {/if}
  </Section>

  {#if $pokemon.length > 0}
    <Section id="editor_types" title="Types">
      <TypePieChart allotment={$pokemonAllotment} />
    </Section>
  {/if}

  <Section id="editor_recs" title="Recommendations">
    {#if $regions.size > 0}
      <Recommendations />
    {:else}
      <p>
        Select some regions on the <IconLink to="settings" /> page to use this feature.
      </p>
    {/if}
  </Section>
</Layout>
