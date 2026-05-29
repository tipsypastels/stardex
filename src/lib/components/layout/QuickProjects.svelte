<script lang="ts">
  import { projects, activeProject } from "$lib/state/projects";
</script>

<div>
  <select
    class="rounded-md border-2 border-slate-300"
    value={$activeProject.id}
    onchange={(e) => {
      e.preventDefault();
      const id = (e.target as HTMLOptionElement).value;
      projects.switchTo(id);
    }}
  >
    {#each $projects as project}
      <option value={project.id}>
        {project.name}
      </option>
    {/each}
  </select>
</div>
