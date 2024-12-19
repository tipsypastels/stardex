<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
</script>

<section class="mb-8 border-b-[1px] border-b-slate-300 pb-8 last:border-b-0">
  <h2 class="mb-8 text-3xl">
    {title}
  </h2>

  <div>
    {@render children()}
  </div>
</section>
