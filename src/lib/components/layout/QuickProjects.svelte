<script lang="ts">
  import { projects, activeProject } from "$lib/state/projects";
</script>

<div>
  <!-- TODO: Do something. -->
  <select class="rounded-md border-2 border-slate-300" value={$activeProject.id}>
    {#each $projects as project}
      <option value={project.id}>
        {project.name}
      </option>
    {/each}
  </select>
</div>
