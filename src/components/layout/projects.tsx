import { signal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import { ProjectsContext } from "../../state/context";
import { Icon } from "../common/icon";
import { Menu } from "../common/menu";
import { Modal } from "./modal";

const modalOpen = signal(false);

export function ProjectsSelect() {
  const projects = useContext(ProjectsContext);

  return (
    <div class="w-max">
      <div class="flex text-sm">
        <div class="grow font-bold">Projects</div>
        <button
          class="cursor-pointer text-lime-600 underline"
          title="Manage all your Stardex projects"
          onClick={() => {
            modalOpen.value = true;
          }}
        >
          View/Manage All
        </button>
      </div>
      <select
        class="w-75 max-w-full rounded-md border-2 border-slate-300"
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

                <div class={`mr-4 text-lime-600 ${project.isActive() ? "" : "opacity-0"}`}>
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
                    class="cursor-pointer px-4 text-lime-600"
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

          <div class="mr-4 text-lime-600">
            <Icon name="plus" />
          </div>

          <div>
            <div>New Project...</div>
          </div>
        </label>
      </Modal>
    </Show>
  );
}
