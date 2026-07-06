<script lang="ts">
  import { base } from "$app/paths";
  import TypeSuggestions from "$lib/components/pokemon/util/TypeSuggestions.svelte";
  import { pokemons } from "$lib/state/pokemons";
  import { regions } from "$lib/state/regions";
  import { strictness } from "$lib/state/strictness";
  import { pokedexFormat } from "$lib/state/pokedex_format";
  import { projects } from "$lib/state/projects";
  import { lastDismissedNoticeDate } from "$lib/state/notices";

  import "drag-drop-touch";
  import "../app.css";

  let { children } = $props();

  const pokemonsPersisted = pokemons.persisted;
  const regionsPersisted = regions.persisted;
  const strictnessPersisted = strictness.persisted;
  const pokedexFormatPersisted = pokedexFormat.persisted;
  const projectsPersisted = projects.persisted;
  const lastDismissedNoticeDatePersisted = lastDismissedNoticeDate.persisted;
</script>

<svelte:head>
  <link href="{base}/fa/css/fontawesome.min.css" rel="stylesheet" />
  <link href="{base}/fa/css/solid.min.css" rel="stylesheet" />
</svelte:head>

{$pokemonsPersisted}
{$regionsPersisted}
{$strictnessPersisted}
{$pokedexFormatPersisted}
{$projectsPersisted}
{$lastDismissedNoticeDatePersisted}

<TypeSuggestions />

{@render children()}
