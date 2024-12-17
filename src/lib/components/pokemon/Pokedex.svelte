<script lang="ts">
  import SpeciesIcon from "./SpeciesIcon.svelte";
  import { pokemon } from "$lib/state/pokemon";
  import TypeDots from "../common/TypeDots.svelte";
  import Modal from "../layout/Modal.svelte";

  let editingIdx = $state<number | undefined>();
  let draggedIdx = $state<number | undefined>();
  let hoveredIdx = $state<number | undefined>();

  $effect(() => {
    if (draggedIdx != null && hoveredIdx != null && draggedIdx !== hoveredIdx) {
      pokemon.swap(draggedIdx, hoveredIdx);
      draggedIdx = hoveredIdx;
    }
  });
</script>

<ol class="mb-4 grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
  {#each $pokemon as mon, i}
    <!-- TODO-->
    <!-- svelte-ignore a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
    <li
      class="relative inline-flex cursor-pointer justify-center transition hover:-translate-y-1"
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
      <TypeDots types={mon.species.type} />
      <SpeciesIcon for={mon.species} />
    </li>
  {/each}
</ol>

<!-- TODO: It is kind of silly that modals render content eagerly :( -->
<Modal
  open={editingIdx != null}
  onclose={() => (editingIdx = undefined)}
  title={$pokemon[editingIdx!]?.species?.name ?? ""}
>
  {@const mon = $pokemon[editingIdx!]}
  {#if mon}
    <pre>{JSON.stringify(mon.species, null, 2)}</pre>
  {/if}
</Modal>
