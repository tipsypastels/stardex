import {
  DEFAULT_PROJECTS,
  deleteProject,
  duplicateActiveProject,
  duplicateInactiveProject,
  getActiveProject,
  pushEmptyProject,
  renameProject,
  switchProjectsToId,
  type Project,
  type ProjectModelState,
} from "$lib/models/projects";
import { derived, get, writable } from "svelte/store";
import { createActions } from "./_actions";
import { createStorage } from "./_storage";
import { pokemon } from "./pokemon";
import { pokedexFormat } from "./pokedex_format";
import { regions } from "./regions";
import { strictness } from "./strictness";

const storage = createStorage<Project[]>("stardex_projects");
const initial = storage.initial ?? DEFAULT_PROJECTS;

export const projects = createActions(initial, (store) => {
  function getModelState(): ProjectModelState {
    return {
      pokemon: get(pokemon),
      pokedexFormat: get(pokedexFormat),
      regions: [...get(regions)],
      strictness: get(strictness),
    };
  }

  return {
    switchTo(id: string) {
      let newModelState: ProjectModelState | undefined;
      const oldModelState: ProjectModelState = getModelState();

      store.update(($oldProjects) => {
        const result = switchProjectsToId($oldProjects, oldModelState, id);
        newModelState = result.newModelState;
        return result.newProjects;
      });

      // If this turns out to be an issue, make a one-time subscriber and set it there.
      if (!newModelState) {
        throw new Error("Svelte did not run project store update synchronously.");
      }

      pokemon.set(newModelState.pokemon);
      pokedexFormat.set(newModelState.pokedexFormat);
      regions.set(newModelState.regions);
      strictness.set(newModelState.strictness);
    },

    pushEmpty() {
      store.update(pushEmptyProject);
    },

    rename(id: string, newName: string) {
      store.update(($projects) => renameProject($projects, id, newName));
    },

    duplicate(project: Project) {
      if (project.active) {
        const modelState = getModelState();
        store.update(($projects) => duplicateActiveProject($projects, modelState));
      } else {
        store.update(($projects) => duplicateInactiveProject($projects, project.id));
      }
    },

    delete(id: string) {
      store.update(($projects) => deleteProject($projects, id));
    },
  };
});

export const activeProject = derived(projects, getActiveProject);
export const projectsModalOpen = writable(false);

export const projectsPersister = storage.persister(projects);
