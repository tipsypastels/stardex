<script lang="ts">
  import { base } from "$app/paths";
  import Persister from "$lib/state/Persister.svelte";
  import { pokemonPersister } from "$lib/state/pokemon";
  import { regionsPersister } from "$lib/state/regions";
  import { strictnessPersister } from "$lib/state/strictness";

  import "drag-drop-touch";
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <link href="{base}/fa/css/fontawesome.min.css" rel="stylesheet" />
  <link href="{base}/fa/css/solid.min.css" rel="stylesheet" />
</svelte:head>

<Persister fn={pokemonPersister} />
<Persister fn={regionsPersister} />
<Persister fn={strictnessPersister} />

<main class="m-auto w-[800px] max-w-full">
  {@render children()}
</main>
