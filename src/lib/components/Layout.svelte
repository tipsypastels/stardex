<script lang="ts">
  import type { Snippet } from "svelte";
  import Nav from "./Nav.svelte";

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
</script>

<h1 class="mb-8 text-center text-4xl font-bold md:text-left">
  {title}
</h1>

<Nav />

<main class="mx-4 md:mx-0">
  {@render children()}
</main>
