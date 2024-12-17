<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
</script>

<section class="mb-8">
  <h2 class="mb-4 text-3xl">
    {title}
  </h2>

  <div>
    {@render children()}
  </div>
</section>
