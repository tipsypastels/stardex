<script lang="ts">
  import { BuiltinPokemon, Pokemon } from "$lib/models/pokemon";
  import { pokemons } from "$lib/state/pokemons";
  import { undefinedIfEmpty } from "$lib/utils/strings";
  import type { Readable } from "svelte/store";
  import { TYPE_SUGGESTIONS_LIST } from "../util/TypeSuggestions.svelte";

  interface Props {
    index: number;
    pokemon: Readable<Pokemon>;
  }

  let { index, pokemon }: Props = $props();
  let isCustom = $derived($pokemon.isCustom());
  let alts = $derived($pokemon.species?.alts ?? []);

  const initialName = $pokemon.name;
  const initialTypeKeys = $pokemon.typeKeys;

  let name = $state(initialName);
  let customType1 = $state(initialTypeKeys[0] ?? "");
  let customType2 = $state(initialTypeKeys[1] ?? "");

  function handleNameBlur() {
    if (name === "") {
      return;
    }
    pokemons.setName(index, name);
  }

  function handleTypeBlur(value: string, typeIndex: number) {
    if (value === "" && typeIndex === 0) {
      return;
    }

    const typeKey = undefinedIfEmpty(value.trim().toLowerCase());
    pokemons.setTypeAt(index, typeIndex, typeKey);
  }

  function setTypes(types: string[]) {
    pokemons.setTypes(index, types);
    customType1 = types[0];
    customType2 = types[1];
  }

  function unsetTypes() {
    pokemons.unsetTypes(index);
    customType1 = $pokemon.typeKeys[0] ?? "";
    customType2 = $pokemon.typeKeys[1] ?? "";
  }
</script>

{#if isCustom}
  <div class="mb-4">
    <h2 class="font-bold">Name</h2>

    <div>
      <input
        class="w-40 border-0 border-b-2 border-b-slate-600"
        bind:value={name}
        onblur={() => handleNameBlur()}
      />
    </div>
  </div>
{/if}

<section class="mb-4">
  <h2 class="font-bold">Types</h2>

  <div>
    <input
      class="w-20 border-0 border-b-2 border-b-slate-600"
      bind:value={customType1}
      onblur={() => handleTypeBlur(customType1, 0)}
      list={TYPE_SUGGESTIONS_LIST}
    />
    and
    <input
      class="w-20 border-0 border-b-2 border-b-slate-600"
      bind:value={customType2}
      onblur={() => handleTypeBlur(customType2, 1)}
      list={TYPE_SUGGESTIONS_LIST}
    />
  </div>

  {#if alts.length > 0}
    <div class="mt-2">
      <h3 class="text-sm">presets:</h3>
      <ul class="list-inside list-disc">
        <li>
          <button class="cursor-pointer text-base text-lime-600 underline" onclick={unsetTypes}
            >normal form</button
          >
        </li>

        {#each alts as alt}
          <li>
            <button
              class="cursor-pointer text-base text-lime-600 underline"
              onclick={() => setTypes(alt.typeKeys)}
            >
              {alt.name} form
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {:else if !isCustom && ($pokemon as BuiltinPokemon).isTypeChanged}
    <div class="mt-2">
      <button class="cursor-pointer text-base text-lime-600 underline" onclick={unsetTypes}
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
      checked={$pokemon.exclude}
      onchange={(e) => pokemons.setExclude(index, e.currentTarget.checked)}
    />
    <div>Exclude this Pokémon from recommendations.</div>
  </label>
</section>
