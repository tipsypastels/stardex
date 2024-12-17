<script lang="ts">
  import Icon from "$lib/components/Icon.svelte";
  import { ALL_REGION_KEYS, resolveRegion } from "$lib/models/region";
  import { disableRegion, enableRegion, regions } from "$lib/state";
</script>

<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
  {#each ALL_REGION_KEYS as regionKey}
    {@const region = resolveRegion(regionKey)}
    {@const checked = $regions.has(regionKey)}
    <label
      class="relative flex cursor-pointer select-none rounded-sm border-[1px] border-slate-300 p-2 transition hover:-translate-y-1"
    >
      <input
        class="hidden"
        type="checkbox"
        {checked}
        onclick={(e) => {
          if (e.currentTarget.checked) {
            enableRegion(regionKey);
          } else {
            disableRegion(regionKey);
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
