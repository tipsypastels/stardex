<script lang="ts">
  import { recommendations } from "$lib/state/metrics";
  import Icon from "../common/Icon.svelte";
</script>

<ul>
  {#each $recommendations as rec}
    {@const { type } = rec}
    <li class="flex items-center border-t-[1px] border-t-slate-300 p-4 first:border-t-0">
      <div class="mr-4 hidden w-[45px] text-4xl md:block" style:color={type.color}>
        <Icon name={type.icon} />
      </div>

      <div class="grow">
        <h2 style:color={type.color}>
          <span class="md:hidden">
            <Icon name={type.icon} />
          </span>
          {type.name}
        </h2>

        <div class="text-base text-gray-600">
          {(rec.ownRatio * 100).toFixed(2)}% —
          {(rec.againstRatio * 100).toFixed(2)}% of compared.
        </div>
      </div>

      {#if rec.change === "add"}
        <div class="font-bold text-red-500">
          <Icon name="square-plus" />
          Too Few
        </div>
      {:else if rec.change === "remove"}
        <div class="font-bold text-red-500">
          <Icon name="square-minus" />
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
