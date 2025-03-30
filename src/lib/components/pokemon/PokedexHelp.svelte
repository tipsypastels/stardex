<script lang="ts">
  import Icon from "../common/Icon.svelte";

  interface Props {
    close?(): void;
  }

  let { close }: Props = $props();
</script>

<div class="rounded-md border-[1px] border-lime-600 p-4">
  <div class="mb-2 flex text-lime-600">
    <h2 class="grow text-xl font-bold">What to Know</h2>

    {#if close}
      <button onclick={close}>
        <Icon name="times" />
      </button>
    {/if}
  </div>

  <ul class="ml-4 list-disc">
    <li>
      <p>Enter a Pokémon's name above to add it to your dex.</p>
    </li>

    <li>
      <p>Click on a Pokémon you've added to change its type or settings.</p>
    </li>

    <li>
      <p>Drag and drop Pokémon you've added to reorder them.</p>
    </li>

    <li>
      <p>You will be given recommendations and statistics based on your Pokédex.</p>
    </li>
  </ul>

  {#if close}
    <div class="mt-4">
      <button class="text-lime-600 underline" onclick={close}>Got it!</button>
    </div>
  {/if}
</div>
