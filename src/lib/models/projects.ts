import { DEFAULT_POKEDEX_FORMAT, type PokedexFormat } from "./pokedex_format";
import type { Pokemon } from "./pokemon";
import { DEFAULT_REGION_KEYS, type RegionKey } from "./region";
import { DEFAULT_STRICTNESS, type Strictness } from "./strictness";

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "default",
    name: "Untitled Project 1",
    active: true,
  },
];

export type Project = ActiveProject | InactiveProject;

export interface ActiveProject {
  id: string;
  name: string;
  active: true;
}

export interface InactiveProject {
  id: string;
  name: string;
  active: false;
  modelState: ProjectModelState;
}

export interface ProjectModelState {
  pokemon: Pokemon[];
  pokedexFormat: PokedexFormat;
  regions: RegionKey[];
  strictness: Strictness;
}

export function getActiveProject(projects: Project[]) {
  const project = projects.find((p): p is ActiveProject => p.active);
  if (!project) throw new Error("Can't determine the active project.");
  return project;
}

export function pushEmptyProject(oldProjects: Project[]) {
  return oldProjects.concat({
    id: crypto.randomUUID(),
    name: `Untitled Project ${oldProjects.length + 1}`,
    active: false,
    modelState: {
      pokemon: [],
      pokedexFormat: DEFAULT_POKEDEX_FORMAT,
      regions: DEFAULT_REGION_KEYS,
      strictness: DEFAULT_STRICTNESS,
    },
  });
}

export function switchProjectsToId(
  oldProjects: Project[],
  oldModelState: ProjectModelState,
  id: string,
) {
  const oldIndex = oldProjects.findIndex((p) => p.active);
  const newIndex = oldProjects.findIndex((p) => !p.active && p.id === id);
  if (newIndex === -1) throw new Error(`Can't switch to unknown project ID '${id}'.`);

  const oldProjectAsActive = oldProjects[oldIndex] as ActiveProject;
  const newProjectAsInactive = oldProjects[newIndex] as InactiveProject;
  const newModelState = newProjectAsInactive.modelState;

  const newProjects = [...oldProjects];

  newProjects[oldIndex] = {
    id: oldProjectAsActive.id,
    name: oldProjectAsActive.name,
    active: false,
    modelState: oldModelState,
  } satisfies InactiveProject;

  newProjects[newIndex] = {
    id: newProjectAsInactive.id,
    name: newProjectAsInactive.name,
    active: true,
  } satisfies ActiveProject;

  return { newProjects, newModelState };
}

export function renameProject(oldProjects: Project[], id: string, newName: string) {
  const index = oldProjects.findIndex((p) => p.id === id);
  if (index === -1) throw new Error(`Can't rename unknown project ID '${id}'.`);

  const newProjects = [...oldProjects];
  newProjects[index] = { ...newProjects[index], name: newName };

  return newProjects;
}

export function deleteProject(oldProjects: Project[], id: string) {
  return oldProjects.filter((project) => {
    if (project.id !== id) return true;
    if (project.active) throw new Error("Can't delete the active project.");
    return false;
  });
}
