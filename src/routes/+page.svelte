<script lang="ts">
  import IconLink from "$lib/components/common/IconLink.svelte";
  import Layout from "$lib/components/layout/Layout.svelte";
  import Logo from "$lib/components/layout/Logo.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import AddPokemon from "$lib/components/pokemon/add/AddPokemon.svelte";
  import Pokedex from "$lib/components/pokemon/Pokedex.svelte";
  import Recommendations from "$lib/components/pokemon/Recommendations.svelte";
  import TypePieChart from "$lib/components/pokemon/util/TypePieChart.svelte";
  import ProjectsModal from "$lib/components/projects/ProjectsModal.svelte";
  import ProjectsSelect from "$lib/components/projects/ProjectsSelect.svelte";
  import { pokemonAllotment } from "$lib/state/metrics";
  import { pokemon } from "$lib/state/pokemon";
  import { regions } from "$lib/state/regions";
</script>

<div class="mx-4 mt-4 mb-8 flex items-center gap-4 border-b-1 border-b-slate-300 pb-6">
  <Logo />
  <ProjectsSelect />
</div>

<div class="mx-8 flex gap-8">
  <div class="grow">
    <AddPokemon />
    <Pokedex />
  </div>

  <div class="grow">
    <TypePieChart allotment={$pokemonAllotment} />
    <Recommendations />
  </div>
</div>

<ProjectsModal />

<!-- <Layout title="Editor">
  <Section id="editor_pokedex" title={`Pokédex (${$pokemon.length})`}>
    <AddPokemon />
    <Pokedex />
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
</Layout> -->
