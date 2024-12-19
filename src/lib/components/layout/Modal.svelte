<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { portal } from "$lib/utils/portal";
  import hotkeys from "hotkeys-js";
  import Icon from "../common/Icon.svelte";

  interface Props {
    title: Snippet;
    children: Snippet;
    footer?: Snippet;
    close(): void;
  }

  let { title, children, footer, close }: Props = $props();

  function handleClick(e: MouseEvent) {
    if ((e.target as HTMLElement)?.parentNode === document.body) {
      close();
    }
  }

  onMount(() => {
    hotkeys("esc", close);
    return () => hotkeys.unbind("esc");
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
  use:portal
  class="fixed bottom-0 left-0 z-10 flex h-screen w-screen items-end justify-center bg-black/30 lg:items-center"
  onclick={handleClick}
>
  <div class="flex h-[60vh] w-[500px] max-w-full flex-col rounded-md bg-white p-8 lg:h-[unset]">
    <div class="mb-4 flex border-b-2 border-b-slate-700 pb-4">
      <h1 class="grow text-xl font-bold">
        {@render title()}
      </h1>

      <button class="text-slate-400" aria-label="Close" onclick={close}>
        <Icon name="times" />
      </button>
    </div>

    <div class="grow">
      {@render children()}
    </div>

    <div>
      {@render footer?.()}
    </div>
  </div>
</div>
