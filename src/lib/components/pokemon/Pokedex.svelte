<script lang="ts">
  import { pokemon } from "$lib/state/pokemon";
  import TypeDots from "../common/TypeDots.svelte";
  import { resolvePokemonName, resolvePokemonTypes } from "$lib/models/pokemon";
  import PokemonIcon from "./icon/PokemonIcon.svelte";
  import EditPokemonModal from "./edit/EditPokemonModal.svelte";

  let editingIdx = $state<number | undefined>();
  let editingMon = $derived(editingIdx != null ? $pokemon[editingIdx] : undefined);

  let draggedIdx = $state<number | undefined>();
  let hoveredIdx = $state<number | undefined>();

  $effect(() => {
    if (draggedIdx != null && hoveredIdx != null && draggedIdx !== hoveredIdx) {
      pokemon.swap(draggedIdx, hoveredIdx);
      draggedIdx = hoveredIdx;
    }
  });
</script>

<ol class="mb-4 grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-8">
  {#each $pokemon as mon, i}
    <!-- TODO-->
    <!-- svelte-ignore a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
    <li
      title={resolvePokemonName(mon)}
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
      <TypeDots types={resolvePokemonTypes(mon)} />
      <PokemonIcon for={mon} />
    </li>
  {/each}
</ol>

<EditPokemonModal index={editingIdx} mon={editingMon} close={() => (editingIdx = undefined)} />
