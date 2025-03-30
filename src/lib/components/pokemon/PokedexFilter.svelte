<script lang="ts">
  import { pokemon } from "$lib/state/pokemon";
  import { pokedexFilterType } from "$lib/state/pokedex_filter";
  import { resolveType } from "$lib/models/type";
  import { resolvePokemonTypeKeys } from "$lib/models/pokemon";

  const allAvailableTypeKeys = $derived([...new Set($pokemon.flatMap(resolvePokemonTypeKeys))]);

  $effect(() => {
    if ($pokedexFilterType && !allAvailableTypeKeys.includes($pokedexFilterType)) {
      $pokedexFilterType = undefined;
    }
  });
</script>

<div class="mb-8 flex items-center gap-2">
  <div class="font-bold">Filter:</div>

  <select bind:value={$pokedexFilterType} class="border-0 text-lime-600 underline">
    <option value={undefined}>All Types</option>

    {#each allAvailableTypeKeys as typeKey}
      {@const type = resolveType(typeKey)}
      <option value={typeKey}>
        {type.name} Type
      </option>
    {/each}
  </select>
</div>
