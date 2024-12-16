<script lang="ts">
  import type { Snippet } from "svelte";
  import Nav from "./Nav.svelte";

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
</script>

<div>
  <h1>
    {title}
  </h1>

  <Nav />

  <div>
    {@render children()}
  </div>
</div>
