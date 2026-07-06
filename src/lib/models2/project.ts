import type { Rekey } from "$lib/utils/types";
import { PokedexFormat, type PokedexFormatKey } from "./pokedex_format";
import { Pokemons, type PokemonData } from "./pokemon";
import { Regions, type RegionKey } from "./region";
import { Strictness, type StrictnessKey } from "./strictness";
import { List as IList } from "immutable";

const V = 1;

export type ProjectData = ActiveProjectData | InactiveProjectData;

interface SharedProjectData {
  v: typeof V;
  id: string;
  name: string;
}

export interface ActiveProjectData extends SharedProjectData {
  active: true;
}

export interface InactiveProjectData extends SharedProjectData {
  active: false;
  modelState: ProjectModelStateData;
}

export interface ProjectModelStateData {
  pokemons: PokemonData[];
  regions: RegionKey[];
  strictness: StrictnessKey;
  pokedexFormat: PokedexFormatKey;
}

export type V0_ProjectModelStateData = Rekey<ProjectModelStateData, "pokemons", "pokemon">;
export type V0_ActiveProjectData = Omit<ActiveProjectData, "v">;
export type V0_InactiveProjectData = Omit<InactiveProjectData, "v" | "modelState"> & {
  modelState: V0_ProjectModelStateData;
};
export type V0_ProjectData = V0_ActiveProjectData | V0_InactiveProjectData;

export class Projects {
  static from(datas: (ProjectData | V0_ProjectData)[]) {
    return new this(IList(datas.map((data) => Project.from(data))));
  }

  static default() {
    return this.from([
      {
        v: V,
        id: "default",
        name: "Untitled Project 1",
        active: true,
      },
    ]);
  }

  #list: IList<Project>;
  #activeIndex: number;
  #active?: ActiveProject;

  private constructor(list: IList<Project>) {
    this.#list = list;
    this.#activeIndex = list.findIndex((p) => p.isActive());
  }

  get active() {
    this.#active ??= this.#resolveActive();
    return this.#active;
  }

  #resolveActive() {
    const project = this.#list.get(this.#activeIndex);
    if (!project || !project.isActive()) {
      throw new Error("Invalid active project index.");
    }
    return project;
  }

  toJson() {
    return this.#list.map((p) => p.toJson()).toArray();
  }
}

export abstract class Project {
  static from(data: ProjectData | V0_ProjectData) {
    return data.active ? ActiveProject.from(data) : InactiveProject.from(data);
  }

  #data: { id: string; name: string };

  protected constructor(data: { id: string; name: string }) {
    this.#data = data;
  }

  get id() {
    return this.#data.id;
  }

  get name() {
    return this.#data.name;
  }

  isActive(): this is ActiveProject {
    return false;
  }

  isInactive(): this is InactiveProject {
    return false;
  }

  toJson() {
    return this.#data;
  }
}

export class ActiveProject extends Project {
  static from(data: ActiveProjectData | V0_ActiveProjectData) {
    if ("v" in data) return new this(data);
    return new this({ v: V, ...data });
  }

  private constructor(data: ActiveProjectData) {
    super(data);
  }

  isActive(): this is ActiveProject {
    return true;
  }
}

export class InactiveProject extends Project {
  static from(data: InactiveProjectData | V0_InactiveProjectData) {
    if ("v" in data) return new this(data);
    const { pokemon: pokemons, ...modelState } = data.modelState;
    return new this({ v: V, ...data, modelState: { pokemons, ...modelState } });
  }

  readonly modelState: ProjectModelState;

  private constructor(data: InactiveProjectData) {
    super(data);
    this.modelState = new ProjectModelState(data.modelState);
  }

  isInactive(): this is InactiveProject {
    return true;
  }
}

export class ProjectModelState {
  #data: ProjectModelStateData;

  constructor(data: ProjectModelStateData) {
    this.#data = data;
  }

  getPokemons() {
    return Pokemons.from(this.#data.pokemons);
  }

  getRegions() {
    return Regions.from(this.#data.regions);
  }

  getStrictness() {
    return Strictness.of(this.#data.strictness);
  }

  getPokedexFormat() {
    return PokedexFormat.of(this.#data.pokedexFormat);
  }
}
