import { PokedexFormat, type PokedexFormatKey } from "./pokedex_format";
import { Pokemons, type PokemonData } from "./pokemon";
import { Regions, type RegionKey } from "./region";
import { Strictness, type StrictnessKey } from "./strictness";

export interface ProjectsData {
  all: ProjectData[];
  active: number;
}

export interface ProjectData {
  id: string;
  name: string;
  pokemons: PokemonData[];
  regions: RegionKey[];
  strictness: StrictnessKey;
  pokedexFormat: PokedexFormatKey;
}

export class Projects {
  static DEFAULT = new this({
    all: [
      {
        id: "default",
        name: "Untitled Project 1",
        pokemons: [],
        regions: Regions.DEFAULT.toArray(),
        strictness: Strictness.DEFAULT.key,
        pokedexFormat: PokedexFormat.DEFAULT.key,
      },
    ],
    active: 0,
  });

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

  #pokemons?: Pokemons;
  #regions?: Regions;
  #strictness?: Strictness;
  #pokedexFormat?: PokedexFormat;

  constructor(data: ProjectData, index: number, active: boolean) {
    this.#data = data;
    this.index = index;
    this.active = active;
  }

  get pokemons() {
    this.#pokemons ??= Pokemons.from(this.#data.pokemons);
    return this.#pokemons;
  }

  get regions() {
    this.#regions ??= Regions.from(this.#data.regions);
    return this.#regions;
  }

  get strictness() {
    this.#strictness ??= Strictness.of(this.#data.strictness);
    return this.#strictness;
  }

  get pokedexFormat() {
    this.#pokedexFormat ??= PokedexFormat.of(this.#data.pokedexFormat);
    return this.#pokedexFormat;
  }
}
