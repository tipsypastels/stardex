<script lang="ts">
  import { projects, activeProject, projectsModalOpen } from "$lib/state/projects";
</script>

<div class="w-max">
  <div class="flex text-sm">
    <div class="grow font-bold">Projects</div>
    <button
      class="cursor-pointer text-lime-600 underline"
      title="Manage all your Stardex projects"
      onclick={() => {
        $projectsModalOpen = true;
      }}>View/Manage All</button
    >
  </div>
  <select
    class="w-[300px] max-w-full rounded-md border-2 border-slate-300"
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
