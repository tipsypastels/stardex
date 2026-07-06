import { PokedexFormat, type PokedexFormatKey } from "./pokedex_format";
import { Pokemon, type PokemonData } from "./pokemon";
import { Regions, type RegionKey } from "./region";
import type { Strictness, StrictnessKey } from "./strictness";

export interface ProjectsData {
  all: ProjectData[];
  active: number;
}

export interface ProjectData {
  pokemon: PokemonData[];
  pokedexFormat: PokedexFormatKey;
  regions: RegionKey[];
  strictness: StrictnessKey;
}

export class Projects {
  static from(data: ProjectsData) {
    return new this(data);
  }

  #data: ProjectsData;

  private constructor(data: ProjectsData) {
    this.#data = data;
  }
}

export class Project {
  #data: ProjectData;
  readonly index: number;
  readonly active: boolean;

  #pokemon?: Pokemon[];
  #pokedexFormat?: PokedexFormat;
  #regions?: Regions;
  #strictness?: Strictness;

  constructor(data: ProjectData, index: number, active: boolean) {
    this.#data = data;
    this.index = index;
    this.active = active;
  }

  get pokemon() {
    this.#pokemon ??= this.#data.pokemon.map((p) => Pokemon.from(p));
    return this.#pokemon;
  }

  get pokedexFormat() {
    this.#pokedexFormat ??= PokedexFormat.of(this.#data.pokedexFormat);
    return this.#pokedexFormat;
  }

  get regions() {
    this.#regions ??= Regions.from(this.#data.regions);
    return this.#regions;
  }

  get strictness() {
    this.#strictness ??= Strictness.of(this.#data.strictness);
    return this.#strictness;
  }
}
