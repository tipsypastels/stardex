<script lang="ts">
  import { base } from "$app/paths";
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <link href="{base}/fa/css/fontawesome.min.css" rel="stylesheet" />
  <link href="{base}/fa/css/solid.min.css" rel="stylesheet" />
</svelte:head>

<main class="m-auto w-[800px] max-w-full">
  {@render children()}
</main>
