<script lang="ts">
  import {
    getPokedexFormatDescription,
    getPokedexFormatName,
    POKEDEX_FORMATS,
  } from "$lib/models/pokedex_format";
  import { pokedexFormat } from "$lib/state/pokedex_format";
  import Icon from "../common/Icon.svelte";
</script>

<div>
  {#each POKEDEX_FORMATS as f}
    {@const checked = $pokedexFormat === f}
    <label
      class="flex cursor-pointer items-center border-t-[1px] border-t-slate-300 p-4 first:border-t-0"
    >
      <input class="hidden" type="radio" name="strictness" onclick={() => pokedexFormat.set(f)} />

      <div class="mr-4 text-lime-600" class:opacity-0={!checked}>
        <Icon name="badge-check" />
      </div>

      <div>
        <div>
          {getPokedexFormatName(f)}
        </div>

        <div class="text-base">
          {getPokedexFormatDescription(f)}
        </div>
      </div>
    </label>
  {/each}
</div>
