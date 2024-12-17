<script lang="ts">
  import type { Snippet } from "svelte";
  import Icon from "./Icon.svelte";

  interface Props {
    open: boolean;
    onclose(): void;
    title: string;
    children: Snippet;
  }

  let { open, onclose, title, children }: Props = $props();
  let dialog = $state<HTMLDialogElement>();

  $effect(() => {
    if (open) dialog?.showModal();
  });

  function onclick(e: MouseEvent) {
    if (e.target === dialog) dialog.close();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
  class="mb-0 hidden max-w-full items-center justify-center open:block md:mb-auto"
  bind:this={dialog}
  {onclose}
  {onclick}
>
  <div class="h-[70vh] w-[500px] max-w-full p-8 md:h-[unset]">
    <div class="mb-4 flex border-b-2 border-b-slate-700 pb-4">
      <h1 class="grow text-xl font-bold">
        {title}
      </h1>

      <button class="text-slate-400" aria-label="Close" onclick={() => dialog?.close()}>
        <Icon name="times" />
      </button>
    </div>

    {@render children()}
  </div>
</dialog>
