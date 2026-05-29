<script lang="ts">
  import { projectsModalOpen } from "$lib/state/projects";
  import Modal from "../layout/Modal.svelte";
  import ProjectsSettings from "./ProjectsSettings.svelte";
</script>

{#if $projectsModalOpen}
  <Modal close={() => ($projectsModalOpen = false)}>
    {#snippet title()}
      Projects
    {/snippet}

    <div class="mb-4">
      <ProjectsSettings />
    </div>

    <div class="text-sm">
      <strong>Tip:</strong> Every project is an independent "instance" of
      <span class="text-lime-600">Stardex</span>, with its own Pokédex, regions, imports/exports,
      and settings. Use them for different regions or games!
    </div>
  </Modal>
{/if}
