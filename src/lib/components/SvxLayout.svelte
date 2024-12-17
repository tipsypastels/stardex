<script lang="ts">
  import type { Snippet } from "svelte";
  import Layout from "./Layout.svelte";

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
</script>

<Layout {title}>
  {@render children()}
</Layout>
