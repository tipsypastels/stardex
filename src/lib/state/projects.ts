import {
  DEFAULT_PROJECTS,
  deleteProject,
  getActiveProject,
  pushEmptyProject,
  renameProject,
  switchProjectsToId,
  type Project,
  type ProjectModelState,
} from "$lib/models/projects";
import { derived, get } from "svelte/store";
import { createActions } from "./_actions";
import { createStorage } from "./_storage";
import { pokemon } from "./pokemon";
import { pokedexFormat } from "./pokedex_format";
import { regions } from "./regions";
import { strictness } from "./strictness";

const storage = createStorage<Project[]>("stardex_projects");
const initial = storage.initial ?? DEFAULT_PROJECTS;

export const projects = createActions(initial, (store) => {
  return {
    switchTo(id: string) {
      let newModelState: ProjectModelState | undefined;
      const oldModelState: ProjectModelState = {
        pokemon: get(pokemon),
        pokedexFormat: get(pokedexFormat),
        regions: [...get(regions)],
        strictness: get(strictness),
      };

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

    delete(id: string) {
      store.update(($projects) => deleteProject($projects, id));
    },
  };
});

export const activeProject = derived(projects, getActiveProject);

export const projectsPersister = storage.persister(projects);
