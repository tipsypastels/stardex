import * as v from "valibot";
import { id } from "../../utils/id";
import { PokedexModeKey } from "../pokedex/mode";
import { RawCustomIconsMetadata } from "../pokemon/custom_icon";
import { RawPokemonList } from "../pokemon/list";
import { RegionKey } from "../region";
import { StrictnessKey } from "../strictness";
import { RawExcludedTypesSet } from "../type/excluded";
import { PROJECT_VERSION, V0_RawProject, V0_upgradeRawProject } from "./versioned";

/* -------------------------------------------------------------------------- */
/*                                     Raw                                    */
/* -------------------------------------------------------------------------- */

export const RawProjectModels = v.object({
  pokemons: RawPokemonList,
  regions: v.array(RegionKey),
  strictness: StrictnessKey,
  pokedexMode: PokedexModeKey,
  customIconsMetadata: RawCustomIconsMetadata,
  excludedTypes: RawExcludedTypesSet,
});

export const RawProject = v.object({
  v: v.literal(PROJECT_VERSION),
  id: v.string(),
  name: v.string(),
  dormantModels: v.optional(RawProjectModels),
});

export type RawProjectModels = v.InferOutput<typeof RawProjectModels>;
export type RawProject = v.InferOutput<typeof RawProject>;

export const VAny_RawProject = v.union([
  RawProject,
  v.pipe(V0_RawProject, v.transform(V0_upgradeRawProject)),
]);

/* -------------------------------------------------------------------------- */
/*                                   Project                                  */
/* -------------------------------------------------------------------------- */

export interface Project {
  readonly id: string;
  name: string;
  dormantModels?: RawProjectModels;
  toRaw(): RawProject;
  toJSON(): unknown;
}

export interface ProjectWithDormantModels extends Project {
  dormantModels: RawProjectModels;
}

export const PROJECTS = (() => {
  function make(raw: RawProject): Project {
    return {
      get id() {
        return raw.id;
      },
      name: raw.name,
      dormantModels: raw.dormantModels,
      toRaw() {
        return {
          v: PROJECT_VERSION,
          id: this.id,
          name: this.name,
          dormantModels: this.dormantModels,
        };
      },
      toJSON() {
        return this.toRaw();
      },
    };
  }

  function makeDuplicateImpl(name: string, dormantModels: RawProjectModels) {
    return make({
      v: PROJECT_VERSION,
      id: id(),
      name: `Copy of ${name}`,
      dormantModels,
    });
  }

  function makeDuplicate(project: Project, getActiveModels: () => RawProjectModels) {
    return makeDuplicateImpl(project.name, project.dormantModels ?? getActiveModels());
  }

  return { make, makeDuplicate };
})();
