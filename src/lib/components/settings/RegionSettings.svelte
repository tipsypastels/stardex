<script lang="ts">
  import Icon from "$lib/components/common/Icon.svelte";
  import {
    ALL_REGION_KEYS,
    INITIAL_REGION_KEYS,
    resolveRegion,
    type RegionKey,
  } from "$lib/models/region";
  import { regions } from "$lib/state/regions";
  import TypeName from "../common/TypeName.svelte";
</script>

<div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
  {#each ALL_REGION_KEYS as regionKey}
    {@const region = resolveRegion(regionKey)}
    {@const checked = $regions.has(regionKey)}
    <label
      class="relative flex cursor-pointer select-none rounded-xs border-[1px] border-slate-300 p-2 transition hover:-translate-y-1"
    >
      <input
        class="hidden"
        type="checkbox"
        {checked}
        onclick={(e) => {
          if (e.currentTarget.checked) {
            regions.enable(regionKey);
          } else {
            regions.disable(regionKey);
          }
        }}
      />

      {#if checked}
        <div class="absolute left-[-0.5rem] top-[-0.5rem] text-lime-600">
          <Icon name="badge-check" />
        </div>
      {/if}

      <div class="mr-2">
        <Icon name={region.icon} />
      </div>

      <div>
        {region.name}
      </div>
    </label>
  {/each}
</div>

<div>
  {#snippet bulkAction(label: string, keys: RegionKey[])}
    <button class="underline hover:text-lime-600" onclick={() => regions.set(keys)}>{label}</button>
  {/snippet}

  Select
  {@render bulkAction("Recommended", INITIAL_REGION_KEYS)}
  {" / "}
  {@render bulkAction("All", ALL_REGION_KEYS)}
  {" / "}
  {@render bulkAction("None", [])}
</div>

{#if $regions.has("kanto")}
  <p class="mt-4 rounded-md bg-amber-400 p-2">
    Kanto has a skewed type balance by the standards of later regions - for example, too many
    <TypeName for="poison" />
    types. You may find that you get better results if you
    <button class="underline" onclick={() => regions.disable("kanto")}>exclude it</button>
    .
  </p>
{/if}
