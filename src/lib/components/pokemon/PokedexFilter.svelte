<script lang="ts">
  import { pokedexFilterType } from "$lib/state/pokedex_filter";
  import { pokemonAllotment } from "$lib/state/metrics";

  $effect(() => {
    if ($pokedexFilterType && !$pokemonAllotment.types.has($pokedexFilterType)) {
      $pokedexFilterType = undefined;
    }
  });
</script>

<div class="mb-8 flex items-center gap-2">
  <div class="font-bold">Filter:</div>

  <select bind:value={$pokedexFilterType} class="border-0 text-lime-600 underline">
    <option value={undefined}>All Types</option>

    {#each $pokemonAllotment.types as [typeKey, { type, count }]}
      <option value={typeKey}>
        {type.name} Type ({count})
      </option>
    {/each}
  </select>
</div>
