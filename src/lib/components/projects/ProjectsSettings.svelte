<script lang="ts">
  import { projects } from "$lib/state/projects";
  import Icon from "../common/Icon.svelte";
  import Menu from "../common/Menu.svelte";
</script>

<div>
  <!-- TODO: Sortable? -->
  {#each $projects as project}
    <div class="flex items-center py-2">
      <label class="flex grow cursor-pointer items-center">
        <input
          class="hidden"
          type="radio"
          name="project"
          checked={project.isActive()}
          onclick={(e) => {
            e.preventDefault();
            if (!project.isActive()) projects.setActive(project.id);
          }}
        />

        <div class="mr-4 text-lime-600" class:opacity-0={!project.isActive()}>
          <Icon name="badge-check" />
        </div>

        <div class="grow">
          {project.name}
        </div>
      </label>

      <Menu
        items={[
          {
            type: "button",
            name: "Rename Project",
            icon: "pen-to-square",
            onclick: () => {
              const name = prompt(
                `Enter a new name for project "${project.name}"...`,
                project.name,
              );

              if (name && name !== project.name) {
                projects.setName(project.id, name);
              }
            },
          },
          {
            type: "button",
            name: "Duplicate Project",
            icon: "clone",
            onclick: () => {
              projects.pushDuplicate(project.id);
            },
          },
          { type: "divider" },
          {
            type: "button",
            name: "Delete Project",
            icon: "times",
            class: "text-red-600",
            onclick: () => {
              if (project.isActive()) {
                return alert(
                  "Can't delete the current project! Make a new project and switch to it first.",
                );
              }

              if (
                project.modelState.hasPokemons ||
                confirm(
                  `Are you sure you want to PERMANENTLY delete project "${project.name}"? All of its data will be lost and CANNOT be recovered.`,
                )
              ) {
                projects.delete(project.id);
              }
            },
          },
        ]}
      >
        {#snippet trigger(toggle)}
          <button class="cursor-pointer px-4 text-lime-600" title="Actions" onclick={toggle}>
            <Icon name="ellipsis" />
          </button>
        {/snippet}
      </Menu>
    </div>
  {/each}

  <label class="flex cursor-pointer items-center py-2">
    <input
      class="hidden"
      type="radio"
      name="new-project"
      onclick={(e) => {
        e.preventDefault();
        projects.pushEmpty();
      }}
    />

    <div class="mr-4 text-lime-600">
      <Icon name="plus" />
    </div>

    <div>
      <div>New Project...</div>
    </div>
  </label>
</div>
