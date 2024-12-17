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

<ol class="mx-auto mb-4 lg:mx-0">
  {#each $pokemon as mon, i}
    <!-- TODO-->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <li
      class="inline-block"
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
