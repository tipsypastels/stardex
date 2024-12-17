<script lang="ts">
  import {
    getStrictnessDescription,
    getStrictnessName,
    type Strictness,
    STRICTNESSES,
  } from "$lib/models/strictness";
  import { setStrictness, strictness } from "$lib/state";
  import Icon from "./Icon.svelte";
</script>

<div>
  {#each STRICTNESSES as s}
    {@const checked = $strictness === s}
    <label
      class="flex cursor-pointer items-center border-t-[1px] border-t-slate-300 p-4 first:border-t-0"
    >
      <input class="hidden" type="radio" name="strictness" onclick={() => setStrictness(s)} />

      <div class="mr-2 text-lime-600" class:opacity-0={!checked}>
        <Icon name="badge-check" />
      </div>

      <div>
        <div>
          {getStrictnessName(s)}
        </div>

        <div class="text-base">
          {getStrictnessDescription(s)}
        </div>
      </div>
    </label>
  {/each}
</div>
