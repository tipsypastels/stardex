<script lang="ts">
  import type { Snippet } from "svelte";
  import Icon from "../common/Icon.svelte";

  interface Props {
    id: string;
    title: string;
    children: Snippet;
  }

  let { id, title, children }: Props = $props();
  let key = $derived(`stardex_section_${id}`);
  // svelte-ignore state_referenced_locally
  let open = $state(localStorage.getItem(key) !== "false");

  function toggle() {
    open = !open;
  }

  $effect(() => {
    localStorage.setItem(key, `${open}`);
  });
</script>

<section class="relative mb-8 border-b-[1px] border-b-slate-300 pb-8 last:mb-0 last:border-b-0">
  <button class="flex w-full items-center text-left" class:mb-8={open} onclick={toggle}>
    <h2 class="grow text-3xl">
      {title}
    </h2>

    <div class="text-xl text-slate-400">
      <Icon name="angle-{open ? 'down' : 'up'}" />
    </div>
  </button>

  {#if open}
    <div>
      {@render children()}
    </div>
  {/if}
</section>
