import { createSelector, createSignal, For, Show } from "solid-js";
import { customIcons } from "../../models/pokemon/custom_icon";
import type { Project } from "../../models/project";
import { projects } from "../../models/project/list";
import { Icon } from "../common/icon";
import { Dropdown, DropdownDivider, DropdownItem } from "../common/menus/dropdown";
import { Modal } from "../common/menus/modal";

const [modalOpen, setModalOpen] = createSignal(false);

export function ProjectsHotkeyButton() {
  return <button id="manage-projects" class="hidden" onClick={() => setModalOpen(true)} />;
}

export function ProjectsSelect() {
  return (
    <div class="w-max">
      <div class="mb-1 flex text-sm">
        <div class="grow font-bold">Projects</div>
        <button
          class="cursor-pointer text-primary underline"
          title="Manage all your Stardex projects"
          onClick={() => setModalOpen(true)}
        >
          View/Manage All
        </button>
      </div>
      <select
        class="w-75 max-w-full border-x-0 border-y-2 border-divider-light bg-background"
        value={projects.activeId}
        onInput={(e) => projects.setActive(e.currentTarget.value)}
      >
        <For each={projects.all}>
          {(project) => <option value={project.id}>{project.name}</option>}
        </For>
      </select>
    </div>
  );
}

export function ProjectsModal() {
  const [dropdownId, setDropdownId] = createSignal<string>();

  return (
    <Show when={modalOpen()}>
      <Modal title="Projects" onClose={() => setModalOpen(false)}>
        <ul class="mb-4">
          <For each={projects.all}>
            {(project) => (
              <ProjectOption
                project={project}
                dropdownId={dropdownId()}
                setDropdownId={setDropdownId}
              />
            )}
          </For>

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
  dropdownId: string | undefined;
  setDropdownId(id: string | undefined): void;
}

function ProjectOption(props: ProjectOptionProps) {
  const dropdownOpen = () => props.dropdownId === props.project.id;
  const isActive = createSelector(() => projects.activeId);

  return (
    <li>
      <div class="flex items-center">
        <label class="flex grow cursor-pointer items-center py-2">
          <input
            class="hidden"
            type="radio"
            name="project"
            checked={isActive(props.project.id)}
            onClick={(e) => {
              e.preventDefault();
              projects.setActive(props.project.id);
            }}
          />

          <div
            class="mr-4 opacity-20"
            classList={{ "text-primary opacity-100!": isActive(props.project.id) }}
          >
            <Icon name="badge-check" />
          </div>

          <div class="grow">{props.project.name}</div>
        </label>

        <button
          class="cursor-pointer text-foreground-lesser"
          classList={{ "text-primary!": dropdownOpen() }}
          title="Actions"
          onClick={() => props.setDropdownId(props.project.id)}
        >
          <Icon name="ellipsis" />
        </button>
      </div>

      <Show when={dropdownOpen()}>
        <Dropdown onClose={() => props.setDropdownId(undefined)}>
          <DropdownItem
            name="Rename Project"
            icon="pen-to-square"
            onClick={() => {
              const name = prompt(`Enter a new name for "${props.project.name}"...`);
              if (name && name !== props.project.name) {
                projects.setName(props.project.id, name);
              }
            }}
          />
          <DropdownItem
            name="Duplicate Project"
            icon="clone"
            onClick={() => {
              projects.pushDuplicate(props.project.id);
            }}
          />
          <DropdownDivider />
          <DropdownItem
            name="Delete Project"
            icon="trash"
            onClick={() => {
              if (isActive(props.project.id)) {
                return alert(
                  "Can't delete the active project! Make a new project and switch to it first.",
                );
              }
              if (
                props.project.dormantModels?.pokemons.all.length === 0 ||
                confirm(
                  `Are you sure you want to PERMANENTLY delete the project "${props.project.name}"?`,
                )
              ) {
                projects.delete(props.project.id);
                customIcons.deleteProject(props.project.id);
              }
            }}
          />
        </Dropdown>
      </Show>
    </li>
  );
}
