<script lang="ts">
  import { isPokemonCustom, resolvePokemonTypeKeys, type Pokemon } from "$lib/models/pokemon";
  import { pokemon } from "$lib/state/pokemon";
  import { undefinedIfEmpty } from "$lib/utils/strings";
  import { TYPE_SUGGESTIONS_LIST } from "../util/TypeSuggestions.svelte";

  interface Props {
    index: number;
    mon: Pokemon;
  }

  let { index, mon }: Props = $props();
  const initialTypeKeys = resolvePokemonTypeKeys(mon);

  let customType1 = $state(initialTypeKeys[0] ?? "");
  let customType2 = $state(initialTypeKeys[1] ?? "");

  function handleBlur(value: string, typeIndex: number) {
    if (value === "" && index === 0) {
      return;
    }

    const typeKey = undefinedIfEmpty(value.trim().toLowerCase());
    pokemon.setType(index, typeIndex, typeKey);
  }

  function resetType() {
    pokemon.resetType(index);
    const typeKeys = resolvePokemonTypeKeys(mon);
    customType1 = typeKeys[0] ?? "";
    customType2 = typeKeys[1] ?? "";
  }
</script>

<section class="mb-4">
  <h2 class="font-bold">Types</h2>

  <div>
    <input
      class="w-20 border-0 border-b-2 border-b-slate-600"
      bind:value={customType1}
      onblur={() => handleBlur(customType1, 0)}
      list={TYPE_SUGGESTIONS_LIST}
    />
    and
    <input
      class="w-20 border-0 border-b-2 border-b-slate-600"
      bind:value={customType2}
      onblur={() => handleBlur(customType2, 1)}
      list={TYPE_SUGGESTIONS_LIST}
    />
  </div>

  {#if !isPokemonCustom(mon) && mon.type}
    <div class="mt-2">
      <button class="text-base text-lime-600 underline" onclick={resetType}
        >Reset Customized Type</button
      >
    </div>
  {/if}
</section>

<section class="mb-4">
  <h2 class="mb-2 font-bold">Behaviour</h2>

  <label class="flex items-center justify-center md:justify-normal">
    <input
      type="checkbox"
      class="mr-2"
      checked={mon.exclude}
      onchange={(e) => pokemon.setExclude(index, e.currentTarget.checked)}
    />
    <div>Exclude this Pokémon from recommendations.</div>
  </label>
</section>
