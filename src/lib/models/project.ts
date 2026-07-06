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

export class Projects implements Iterable<Project> {
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

  setActive(id: string, modelStateData: ProjectModelStateData) {
    if (id === this.active.id) {
      return {
        projects: this,
        modelStateData,
      };
    }

    const index = this.#findIndex(id);
    const active = this.#list.get(index) as InactiveProject;

    if (!active || active.isActive()) {
      throw new Error("Multiple active projects, broken switch state.");
    }

    const newModelStateData = active.modelState.toJson();
    const list = this.#list.withMutations((list) => {
      list
        .set(this.#activeIndex, this.active.intoInactive(modelStateData))
        .set(index, active.intoActive());
    });

    return {
      projects: this.#dup(list),
      modelStateData: newModelStateData,
    };
  }

  setName(id: string, name: string) {
    const index = this.#findIndex(id);
    const list = this.#list.update(index, (project) =>
      project ? project.setName(name) : undefined,
    );
    return this.#dup(list);
  }

  pushEmpty() {
    return this.#dup(
      this.#list.push(
        InactiveProject.from({
          v: V,
          id: crypto.randomUUID(),
          name: `Untitled Project ${this.#list.size}`,
          active: false,
          modelState: {
            pokemons: [],
            regions: Regions.DEFAULT.keys(),
            strictness: Strictness.DEFAULT.key,
            pokedexFormat: PokedexFormat.DEFAULT.key,
          },
        }),
      ),
    );
  }

  pushDuplicate(id: string, getModelStateData: () => ProjectModelStateData) {
    const index = this.#findIndex(id);
    const project = this.#list.get(index)!;
    const modelStateData = project.isInactive() ? project.modelState.toJson() : getModelStateData();
    const duplicate = InactiveProject.from({
      v: V,
      id: crypto.randomUUID(),
      name: `Copy of ${project.name}`,
      active: false,
      modelState: modelStateData,
    });
    const list = this.#list.insert(index + 1, duplicate);
    return this.#dup(list);
  }

  delete(id: string) {
    const index = this.#findIndex(id);
    return this.#dup(this.#list.delete(index));
  }

  #findIndex(id: string) {
    const index = this.#list.findIndex((project) => project.id === id);
    if (index === -1) {
      throw new Error(`Can't find project with ID '${id}'.`);
    }
    return index;
  }

  #dup(list: IList<Project>) {
    return new Projects(list);
  }

  [Symbol.iterator]() {
    return this.#list[Symbol.iterator]();
  }

  toJson() {
    return this.#list.map((p) => p.toJson()).toArray();
  }
}

export type Project = ActiveProject | InactiveProject;

export namespace Project {
  export function from(data: ProjectData | V0_ProjectData) {
    return data.active ? ActiveProject.from(data) : InactiveProject.from(data);
  }
}

export abstract class BaseProject {
  protected abstract shared: SharedProjectData;
  protected abstract clone(): Project;

  get id() {
    return this.shared.id;
  }

  get name() {
    return this.shared.name;
  }

  setName(name: string) {
    const dup = this.clone() as unknown as this;
    dup.shared.name = name;
    return dup;
  }

  isActive(): this is ActiveProject {
    return false;
  }

  isInactive(): this is InactiveProject {
    return false;
  }

  toJson() {
    return this.shared;
  }
}

export class ActiveProject extends BaseProject {
  static from(data: ActiveProjectData | V0_ActiveProjectData) {
    if ("v" in data) return new this(data);
    return new this({ v: V, ...data });
  }

  #data: ActiveProjectData;

  private constructor(data: ActiveProjectData) {
    super();
    this.#data = data;
  }

  protected get shared() {
    return this.#data;
  }

  protected clone() {
    return new ActiveProject({ ...this.#data });
  }

  isActive(): this is ActiveProject {
    return true;
  }

  intoInactive(modelStateData: ProjectModelStateData) {
    return InactiveProject.from({
      v: V,
      id: this.id,
      name: this.name,
      active: false,
      modelState: modelStateData,
    });
  }
}

export class InactiveProject extends BaseProject {
  static from(data: InactiveProjectData | V0_InactiveProjectData) {
    if ("v" in data) return new this(data);
    const { pokemon: pokemons, ...modelState } = data.modelState;
    return new this({ v: V, ...data, modelState: { pokemons, ...modelState } });
  }

  #data: InactiveProjectData;
  readonly modelState: ProjectModelState;

  private constructor(data: InactiveProjectData) {
    super();
    this.#data = data;
    this.modelState = new ProjectModelState(data.modelState);
  }

  protected get shared() {
    return this.#data;
  }

  protected clone() {
    return new InactiveProject({ ...this.#data });
  }

  isInactive(): this is InactiveProject {
    return true;
  }

  intoActive() {
    return ActiveProject.from({
      v: V,
      id: this.id,
      name: this.name,
      active: true,
    });
  }
}

// TODO: Is this type even useful.
export class ProjectModelState {
  #data: ProjectModelStateData;

  constructor(data: ProjectModelStateData) {
    this.#data = data;
  }

  get hasPokemons() {
    return this.#data.pokemons.length > 0;
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

  toJson() {
    return this.#data;
  }
}
