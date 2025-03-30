<script lang="ts">
  import { pokemon } from "$lib/state/pokemon";
  import { pokedexFilterType } from "$lib/state/pokedex_filter";
  import { resolveType } from "$lib/models/type";
  import { resolvePokemonTypeKeys } from "$lib/models/pokemon";

  function getAllAvailableTypeKeys() {
    const map = new Map<string, number>();

    for (const mon of $pokemon) {
      for (const typeKey of resolvePokemonTypeKeys(mon)) {
        const currCount = map.get(typeKey) ?? 0;
        map.set(typeKey, currCount + 1);
      }
    }

    return map;
  }

  const allAvailableTypeKeys = $derived(getAllAvailableTypeKeys());

  $effect(() => {
    if ($pokedexFilterType && !allAvailableTypeKeys.has($pokedexFilterType)) {
      $pokedexFilterType = undefined;
    }
  });
</script>

<div class="mb-8 flex items-center gap-2">
  <div class="font-bold">Filter:</div>

  <select bind:value={$pokedexFilterType} class="border-0 text-lime-600 underline">
    <option value={undefined}>All Types</option>

    {#each allAvailableTypeKeys as [typeKey, typeCount]}
      {@const type = resolveType(typeKey)}
      <option value={typeKey}>
        {type.name} Type ({typeCount})
      </option>
    {/each}
  </select>
</div>
