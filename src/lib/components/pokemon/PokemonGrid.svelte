<script lang="ts">
  import SpeciesIcon from "./SpeciesIcon.svelte";
  import { pokemon, swapPokemon } from "$lib/state";

  let draggedIdx = $state<number | undefined>();
  let hoveredIdx = $state<number | undefined>();

  $effect(() => {
    if (draggedIdx != null && hoveredIdx != null && draggedIdx !== hoveredIdx) {
      swapPokemon(draggedIdx, hoveredIdx);
      draggedIdx = hoveredIdx;
    }
  });
</script>

<ol class="mb-4 grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
  {#each $pokemon as mon, i}
    <!-- TODO-->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <li
      class="inline-flex justify-center"
      draggable="true"
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
      <SpeciesIcon for={mon.species} />
    </li>
  {/each}
</ol>
