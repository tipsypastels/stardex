import { PokedexFormat, type PokedexFormatKey } from "./pokedex_format";
import { Pokemons, type PokemonData } from "./pokemon";
import { Regions, type RegionKey } from "./region";
import { Strictness, type StrictnessKey } from "./strictness";
import { List as IList } from "immutable";

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: "default",
    name: "Untitled Project 1",
    active: true,
  },
];

export type ProjectData = ActiveProjectData | InactiveProjectData;

export interface ActiveProjectData {
  id: string;
  name: string;
  active: true;
}

export interface InactiveProjectData {
  id: string;
  name: string;
  active: false;
  modelState: ProjectModelStateData;
}

export interface ProjectModelStateData {
  pokemon: PokemonData[];
  regions: RegionKey[];
  strictness: StrictnessKey;
  pokedexFormat: PokedexFormatKey;
}

export class Projects {
  static from(datas: ProjectData[]) {
    return new this(IList(datas.map((data) => Project.from(data))));
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
}

export abstract class Project {
  static from(data: ProjectData) {
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
  static from(data: ActiveProjectData) {
    return new this(data);
  }

  private constructor(data: ActiveProjectData) {
    super(data);
  }

  isActive(): this is ActiveProject {
    return true;
  }
}

export class InactiveProject extends Project {
  static from(data: InactiveProjectData) {
    return new this(data);
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
    return Pokemons.from(this.#data.pokemon);
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
