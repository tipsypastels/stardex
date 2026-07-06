<script lang="ts">
  import { pokemons } from "$lib/state/pokemons";
  import { pokedexFormat } from "$lib/state/pokedex_format";
  import TypeDots from "../common/TypeDots.svelte";
  import { type Pokemon } from "$lib/models/pokemon";
  import PokemonIcon from "./icon/PokemonIcon.svelte";
  import PokedexHelp from "./PokedexHelp.svelte";
  import PokedexFilter from "./PokedexFilter.svelte";
  import EditPokemonModal from "./edit/EditPokemonModal.svelte";
  import Icon from "../common/Icon.svelte";
  import { pokedexFilterType } from "$lib/state/pokedex_filter";
  import { PokedexFormat } from "$lib/models/pokedex_format";

  let editingIdx = $state<number | undefined>();
  let editingPokemon = $derived(editingIdx != null ? pokemons.get(editingIdx) : undefined);

  let draggedIdx = $state<number | undefined>();
  let hoveredIdx = $state<number | undefined>();
  let needsHelp = $state(false);

  $effect(() => {
    if (draggedIdx != null && hoveredIdx != null && draggedIdx !== hoveredIdx) {
      pokemons.swap(draggedIdx, hoveredIdx);
      draggedIdx = hoveredIdx;
    }
  });
</script>

{#snippet entry(pokemon: Pokemon)}
  {#if $pokedexFormat === PokedexFormat.ICONS}
    <TypeDots types={pokemon.types} />
    <PokemonIcon for={pokemon} />
  {:else}
    <div class="flex w-full gap-2 border-[1px] border-slate-300 px-4 py-2">
      <div class="grow">
        {pokemon.name}
      </div>

      {#each pokemon.types as type}
        <div title={type.name} style="color: {type.color}">
          <Icon name={type.icon} />
        </div>
      {/each}
    </div>
  {/if}
{/snippet}

{#snippet entries()}
  {#each $pokemons.toArray() as pokemon, i}
    {#if !$pokedexFilterType || pokemon.typeKeys.includes($pokedexFilterType)}
      <!-- TODO-->
      <!-- svelte-ignore a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
      <li
        title={pokemon.name}
        class="relative inline-flex cursor-pointer justify-center transition hover:-translate-y-1"
        class:opacity-50={pokemon.exclude}
        draggable="true"
        onclick={() => {
          editingIdx = i;
        }}
        ondragstart={() => {
          draggedIdx = i;
        }}
        ondragover={(e) => {
          // prevent the ghost from flying back
          e.preventDefault();
          hoveredIdx = i;
        }}
        ondragend={() => {
          draggedIdx = undefined;
          hoveredIdx = undefined;
        }}
      >
        {@render entry(pokemon)}
      </li>
    {/if}
  {/each}
{/snippet}

{#if $pokemons.size > 0}
  <PokedexFilter />

  {#if $pokedexFormat === PokedexFormat.ICONS}
    <ol class="mb-4 grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8">
      {@render entries()}
    </ol>
  {:else}
    <ol class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      {@render entries()}
    </ol>
  {/if}

  {#if needsHelp}
    <PokedexHelp close={() => (needsHelp = false)} />
  {:else}
    <div class="text-right">
      <button class="text-sm text-lime-600 underline" onclick={() => (needsHelp = true)}
        >Need help?</button
      >
    </div>
  {/if}
{:else}
  <PokedexHelp />
{/if}

<EditPokemonModal
  index={editingIdx}
  pokemon={editingPokemon}
  close={() => (editingIdx = undefined)}
/>
