<script lang="ts">
  import { PokedexFormat } from "$lib/models/pokedex_format";
  import { pokedexFormat } from "$lib/state/pokedex_format";
  import Icon from "../common/Icon.svelte";
</script>

<div>
  {#each PokedexFormat.ALL as f}
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
          {f.name}
        </div>

        <div class="text-base">
          {f.description}
        </div>
      </div>
    </label>
  {/each}
</div>
