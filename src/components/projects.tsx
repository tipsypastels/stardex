import { Signal, signal, useComputed, useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { InactiveProject, Project } from "../models/project";
import type { ProjectList } from "../models/project/list";
import { ProjectsContext } from "../state/context";
import { Icon } from "./common/icon";
import { Dropdown, DropdownDivider, DropdownItem } from "./common/menus/dropdown";
import { Modal } from "./common/menus/modal";

const modalOpen = signal(false);

export function ProjectsSelect() {
  const projects = useContext(ProjectsContext);

  return (
    <div class="w-max">
      <div class="mb-1 flex text-sm">
        <div class="grow font-bold">Projects</div>
        <button
          class="cursor-pointer text-primary underline"
          title="Manage all your Stardex projects"
          onClick={() => {
            modalOpen.value = true;
          }}
        >
          View/Manage All
        </button>
      </div>
      <select
        class="w-75 max-w-full border-x-0 border-y-2 border-divider-light bg-background"
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
  const dropdownId = useSignal<string>();

  return (
    <Show when={modalOpen}>
      <Modal title="Projects" onClose={() => (modalOpen.value = false)}>
        <ul class="mb-4">
          {projects.all.value
            .map((project) => (
              <ProjectOption project={project} projects={projects} dropdownId={dropdownId} />
            ))
            .toArray()}

          <li class="flex items-center">
            <button
              class="flex grow cursor-pointer items-center py-2"
              onClick={() => projects.pushEmpty()}
            >
              <div class="mr-4 text-primary">
                <Icon name="plus" />
              </div>
              <div>New Project...</div>
            </button>
          </li>
        </ul>

        <div class="text-sm">
          <strong>Tip:</strong> Every project is an independent "instance" of{" "}
          <span class="text-primary">Stardex</span>, with its own Pokédex, regions, imports/exports,
          and settings. Use them for different regions or games!
        </div>
      </Modal>
    </Show>
  );
}

interface ProjectOptionProps {
  project: Project;
  projects: ProjectList;
  dropdownId: Signal<string | undefined>;
}

function ProjectOption({ project, projects, dropdownId }: ProjectOptionProps) {
  const dropdownOpen = useComputed(() => dropdownId.value === project.id.value);

  return (
    <li>
      <div class="flex items-center">
        <label class="flex grow cursor-pointer items-center py-2">
          <input
            class="hidden"
            type="radio"
            name="project"
            checked={project.active}
            onClick={(e) => {
              e.preventDefault();
              projects.setActive(project.id.value);
            }}
          />

          <div
            class="mr-4 opacity-20 data-[active=true]:text-primary data-[active=true]:opacity-100"
            data-active={project.active}
          >
            <Icon name="badge-check" />
          </div>

          <div class="grow">{project.name}</div>
        </label>

        <button
          class="cursor-pointer touch-manipulation text-foreground-lesser data-[open=true]:text-primary"
          data-open={dropdownOpen}
          title="Actions"
          onClick={() => (dropdownId.value = project.id.value)}
        >
          <Icon name="ellipsis" />
        </button>
      </div>

      <Show when={dropdownOpen}>
        <Dropdown onClose={() => (dropdownId.value = undefined)}>
          <DropdownItem
            name="Rename Project"
            icon="pen-to-square"
            onClick={() => {
              const name = prompt(`Enter a new name for "${project.name.value}"...`);
              if (name && name !== project.name.value) {
                project.setName(name);
              }
            }}
          />
          <DropdownItem
            name="Duplicate Project"
            icon="clone"
            onClick={() => {
              projects.pushDuplicate(project.id.value);
            }}
          />
          <DropdownDivider />
          <DropdownItem
            name="Delete Project"
            icon="trash"
            onClick={() => {
              if (project.active.value) {
                return alert(
                  "Can't delete the active project! Make a new project and switch to it first.",
                );
              }
              if (
                (project as InactiveProject).raw.value.models.pokemons.all.length === 0 ||
                confirm(
                  `Are you sure you want to PERMANENTLY delete the project "${project.name}"?`,
                )
              ) {
                projects.delete(project.id.value);
              }
            }}
          />
        </Dropdown>
      </Show>
    </li>
  );
}
