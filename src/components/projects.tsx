import { signal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import { ProjectsContext } from "../state/context";
import { Icon } from "./common/icon";
import { Menu } from "./common/menus/menu";
import { Modal } from "./common/menus/modal";

const modalOpen = signal(false);

export function ProjectsSelect() {
  const projects = useContext(ProjectsContext);

  return (
    <div class="w-max">
      <div class="mb-1 flex text-sm">
        <div class="grow font-bold">Projects</div>
        <button
          class="text-primary cursor-pointer underline"
          title="Manage all your Stardex projects"
          onClick={() => {
            modalOpen.value = true;
          }}
        >
          View/Manage All
        </button>
      </div>
      <select
        class="border-divider-light bg-background w-75 max-w-full border-x-0 border-y-2"
        value={projects.active.value.id}
        onChange={(e) => {
          e.preventDefault();
          const id = (e.target as HTMLOptionElement).value;
          projects.setActive(id);
        }}
      >
        {projects.all.value
          .map((project) => <option value={project.id}>{project.name}</option>)
          .toArray()}
      </select>
    </div>
  );
}

export function ProjectsModal() {
  const projects = useContext(ProjectsContext);
  return (
    <Show when={modalOpen}>
      <Modal title="Projects" onClose={() => (modalOpen.value = false)}>
        <div class="mb-4">
          {/* TODO: Sortable? */}
          {projects.all.value
            .map((project) => (
              <div class="flex items-center py-2">
                <label class="flex grow cursor-pointer items-center">
                  <input
                    class="hidden"
                    type="radio"
                    name="project"
                    checked={project.isActive()}
                    onClick={(e) => {
                      e.preventDefault();
                      projects.setActive(project.id.value);
                    }}
                  />

                  <div class={`text-primary mr-4 ${project.isActive() ? "" : "opacity-0"}`}>
                    <Icon name="badge-check" />
                  </div>

                  <div class="grow">{project.name}</div>
                </label>

                <Menu
                  items={[
                    {
                      type: "button",
                      name: "Rename Project",
                      icon: "pen-to-square",
                      onClick: () => {
                        const name = prompt(
                          `Enter a new name for project "${project.name}"...`,
                          project.name.value,
                        );

                        if (name && name !== project.name.value) {
                          project.name.value = name;
                        }
                      },
                    },
                    {
                      type: "button",
                      name: "Duplicate Project",
                      icon: "clone",
                      onClick: () => {
                        projects.pushDuplicate(project.id.value);
                      },
                    },
                    { type: "divider" },
                    {
                      type: "button",
                      name: "Delete Project",
                      icon: "times",
                      class: "text-red-600",
                      onClick: () => {
                        if (project.isActive()) {
                          return alert(
                            "Can't delete the current project! Make a new project and switch to it first.",
                          );
                        }

                        if (
                          confirm(
                            `Are you sure you want to PERMANENTLY delete project "${project.name}"? All of its data will be lost and CANNOT be recovered.`,
                          )
                        ) {
                          projects.delete(project.id.value);
                        }
                      },
                    },
                  ]}
                  trigger={(toggle) => (
                    <button
                      class="text-primary cursor-pointer px-4"
                      title="Actions"
                      onClick={toggle}
                    >
                      <Icon name="ellipsis" />
                    </button>
                  )}
                ></Menu>
              </div>
            ))
            .toArray()}

          <label class="flex cursor-pointer items-center py-2">
            <input
              class="hidden"
              type="radio"
              name="new-project"
              onClick={(e) => {
                e.preventDefault();
                projects.pushEmpty();
              }}
            />

            <div class="text-primary mr-4">
              <Icon name="plus" />
            </div>

            <div>
              <div>New Project...</div>
            </div>
          </label>
        </div>

        <div class="text-sm">
          <strong>Tip:</strong> Every project is an independent "instance" of{" "}
          <span class="text-primary">Stardex</span>, with its own Pokédex, regions, imports/exports,
          and settings. Use them for different regions or games!
        </div>
      </Modal>
    </Show>
  );
}
