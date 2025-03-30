<script lang="ts">
  import { pokemon } from "$lib/state/pokemon";
  import { pokedexFormat } from "$lib/state/pokedex_format";
  import TypeDots from "../common/TypeDots.svelte";
  import { resolvePokemonName, resolvePokemonTypes } from "$lib/models/pokemon";
  import PokemonIcon from "./icon/PokemonIcon.svelte";
  import PokedexHelp from "./PokedexHelp.svelte";
  import EditPokemonModal from "./edit/EditPokemonModal.svelte";
  import Icon from "../common/Icon.svelte";

  let editingIdx = $state<number | undefined>();
  let editingMon = $derived(editingIdx != null ? $pokemon[editingIdx] : undefined);

  let draggedIdx = $state<number | undefined>();
  let hoveredIdx = $state<number | undefined>();
  let needsHelp = $state(false);

  $effect(() => {
    if (draggedIdx != null && hoveredIdx != null && draggedIdx !== hoveredIdx) {
      pokemon.swap(draggedIdx, hoveredIdx);
      draggedIdx = hoveredIdx;
    }
  });
</script>

{#snippet entries()}
  {#each $pokemon as mon, i}
    {@const monName = resolvePokemonName(mon)}

    <!-- TODO-->
    <!-- svelte-ignore a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
    <li
      title={monName}
      class="relative inline-flex cursor-pointer justify-center transition hover:-translate-y-1"
      class:opacity-50={mon.exclude}
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
      {#if $pokedexFormat === "icons"}
        <TypeDots types={resolvePokemonTypes(mon)} />
        <PokemonIcon for={mon} />
      {:else}
        <div class="flex w-full gap-2 border-[1px] border-slate-300 px-4 py-2">
          <div class="grow">
            {monName}
          </div>

          {#each resolvePokemonTypes(mon) as type}
            <div title={type.name} style="color: {type.color}">
              <Icon name={type.icon} />
            </div>
          {/each}
        </div>
      {/if}
    </li>
  {/each}
{/snippet}

{#if $pokemon.length > 0}
  {#if $pokedexFormat === "icons"}
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
      <button class=" text-sm text-lime-600 underline" onclick={() => (needsHelp = true)}
        >Need help?</button
      >
    </div>
  {/if}
{:else}
  <PokedexHelp />
{/if}

<EditPokemonModal index={editingIdx} mon={editingMon} close={() => (editingIdx = undefined)} />
