<script lang="ts">
  import { recommendations } from "$lib/state/metrics";
  import Icon from "../common/Icon.svelte";
</script>

<ul>
  {#each $recommendations as rec}
    {@const { type } = rec}
    <li class="flex items-center border-t-[1px] border-t-slate-300 p-4 first:border-t-0">
      <div class="mr-4 w-[45px] text-4xl" style:color={type.color}>
        <Icon name={type.icon} />
      </div>

      <h2 class="grow" style:color={type.color}>
        {type.name}
      </h2>

      {#if rec.change === "add"}
        <div class="font-bold text-red-500">
          <Icon name="thumbs-up" />
          Too Few
        </div>
      {:else if rec.change === "remove"}
        <div class="font-bold text-red-500">
          <Icon name="thumbs-down" />
          Too Many
        </div>
      {:else}
        <div class="font-bold text-lime-600">
          <Icon name="check" />
          All Good
        </div>
      {/if}
    </li>
  {/each}
</ul>
