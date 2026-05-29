import { test, expect, describe } from "vitest";
import { DEFAULT_POKEDEX_FORMAT } from "./pokedex_format";
import {
  getActiveProject,
  switchProjectsToId,
  type ActiveProject,
  type InactiveProject,
  type ProjectModelState,
} from "./projects";
import { DEFAULT_REGION_KEYS } from "./region";
import { resolveSpecies } from "./species";
import { DEFAULT_STRICTNESS } from "./strictness";

function makeProject(id: string, name: string, pokemonKey: string) {
  const modelState: ProjectModelState = {
    pokemon: [{ species: resolveSpecies(pokemonKey)! }],
    pokedexFormat: DEFAULT_POKEDEX_FORMAT,
    regions: DEFAULT_REGION_KEYS,
    strictness: DEFAULT_STRICTNESS,
  };
  const active: ActiveProject = {
    id,
    name,
    active: true,
  };
  const inactive: InactiveProject = {
    id,
    name,
    active: false,
    modelState,
  };
  return { modelState, active, inactive, id };
}

const GR = makeProject("gr", "Grass", "bulbasaur");
const FR = makeProject("fr", "Fire", "charmander");
const WA = makeProject("wa", "Water", "squirtle");

describe("active project", () => {
  test("getting it", () => {
    const projects = [GR.inactive, FR.active, WA.inactive];
    expect(getActiveProject(projects)).toEqual(FR.active);
  });
});

describe("switching projects", () => {
  test("switching", () => {
    const oldProjects = [GR.active, FR.inactive, WA.inactive];
    const result = switchProjectsToId(oldProjects, GR.modelState, WA.id);

    expect(result).toEqual({
      newProjects: [GR.inactive, FR.inactive, WA.active],
      newModelState: WA.modelState,
    });
  });
});
