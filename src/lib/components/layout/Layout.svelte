<script lang="ts">
  import type { Snippet } from "svelte";
  import Nav from "./Nav.svelte";
  import Logo from "./Logo.svelte";

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
</script>

<Logo />

<div class="mb-8 flex items-center">
  <h1 class="grow text-center text-4xl font-bold md:text-left">
    {title}
  </h1>
</div>

<Nav />

<main class="mx-4 md:mx-0">
  {@render children()}
</main>
