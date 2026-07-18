import * as v from "valibot";
import { id } from "../../utils/id";
import { PokedexModeKey } from "../pokedex/mode";
import { RawCustomIconsMetadata } from "../pokemon/custom_icon/metadata";
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

const RawSharedProject = v.object({
  v: v.literal(PROJECT_VERSION),
  id: v.string(),
  name: v.string(),
});

export const RawActiveProject = v.object({
  ...RawSharedProject.entries,
  active: v.literal(true),
});

export const RawInactiveProject = v.object({
  ...RawSharedProject.entries,
  active: v.literal(false),
  models: RawProjectModels,
});

export const RawProject = v.union([RawActiveProject, RawInactiveProject]);

export type RawProjectModels = v.InferOutput<typeof RawProjectModels>;
export type RawActiveProject = v.InferOutput<typeof RawActiveProject>;
export type RawInactiveProject = v.InferOutput<typeof RawInactiveProject>;
export type RawProject = v.InferOutput<typeof RawProject>;

export const VAny_RawProject = v.union([
  RawProject,
  v.pipe(V0_RawProject, v.transform(V0_upgradeRawProject)),
]);

/* -------------------------------------------------------------------------- */
/*                                   Shared                                   */
/* -------------------------------------------------------------------------- */

export type Project = ActiveProject | InactiveProject;

export const PROJECTS = (() => {
  function make(raw: RawProject) {
    return raw.active ? ACTIVE_PROJECTS.make(raw) : INACTIVE_PROJECTS.make(raw);
  }

  function duplicateImpl(name: string, models: RawProjectModels) {
    return INACTIVE_PROJECTS.make({
      v: PROJECT_VERSION,
      id: id(),
      name: `Copy of ${name}`,
      active: false,
      models,
    });
  }

  function makeInactiveDuplicate(project: Project, getActiveModels: () => RawProjectModels) {
    return duplicateImpl(project.name, project.active ? getActiveModels() : project.toRaw().models);
  }

  return { make, makeInactiveDuplicate };
})();

/* -------------------------------------------------------------------------- */
/*                                   Active                                   */
/* -------------------------------------------------------------------------- */

export interface ActiveProject {
  readonly id: string;
  name: string;
  readonly active: true;
  toRaw(): RawActiveProject;
  toJSON(): unknown;
}

export const ACTIVE_PROJECTS = (() => {
  function make(raw: RawActiveProject): ActiveProject {
    return {
      get id() {
        return raw.id;
      },
      name: raw.name,
      get active() {
        return raw.active;
      },
      toRaw() {
        return {
          v: PROJECT_VERSION,
          id: this.id,
          name: this.name,
          active: this.active,
        };
      },
      toJSON() {
        return this.toRaw();
      },
    };
  }

  function toInactive(project: ActiveProject, models: RawProjectModels) {
    return INACTIVE_PROJECTS.make({ ...project.toRaw(), active: false, models });
  }

  return { make, toInactive };
})();

/* -------------------------------------------------------------------------- */
/*                                  Inactive                                  */
/* -------------------------------------------------------------------------- */

export interface InactiveProject {
  readonly id: string;
  name: string;
  readonly active: false;
  readonly models: RawProjectModels;
  toRaw(): RawInactiveProject;
  toJSON(): unknown;
}

export const INACTIVE_PROJECTS = (() => {
  function make(raw: RawInactiveProject): InactiveProject {
    return {
      get id() {
        return raw.id;
      },
      name: raw.name,
      get active() {
        return raw.active;
      },
      get models() {
        return raw.models;
      },
      toRaw() {
        return {
          v: PROJECT_VERSION,
          id: this.id,
          name: this.name,
          active: this.active,
          models: this.models,
        };
      },
      toJSON() {
        return this.toRaw();
      },
    };
  }

  function toActiveAndModels(project: InactiveProject) {
    const { models, ...raw } = project.toRaw();
    const active = ACTIVE_PROJECTS.make({ ...raw, active: true });
    return { active, models };
  }

  return { make, toActiveAndModels };
})();

/**
 * import { computed, createModel, effect, signal, type ReadonlySignal } from "@preact/signals";
import { id } from "../../state/id";
import { readonly, type Lifter } from "../../utils/signal";
import type { PokedexModeKey } from "../pokedex/mode";
import type { RawCustomIconsMetadata } from "../pokemon/custom_icon/metadata";
import type { RawPokemonList } from "../pokemon/list";
import type { RegionKey } from "../region";
import type { StrictnessKey } from "../strictness";
import type { RawExcludedTypesSet } from "../type/excluded";
import { PROJECT_VERSION, upgradeRawProject } from "../versioned";
import type { V0_RawProject } from "../versioned/v0";

export interface RawProjectModels {
  pokemons: RawPokemonList;
  regions: RegionKey[];
  strictness: StrictnessKey;
  pokedexMode: PokedexModeKey;
  customIconsMetadata: RawCustomIconsMetadata;
  excludedTypes: RawExcludedTypesSet;
}

export interface RawSharedProject {
  v: typeof PROJECT_VERSION;
  id: string;
  name: string;
}

export interface RawActiveProject extends RawSharedProject {
  active: true;
}

export interface RawInactiveProject extends RawSharedProject {
  active: false;
  models: RawProjectModels;
}

export type RawProject = RawActiveProject | RawInactiveProject;

export type Project = InstanceType<typeof Project>;

export type ActiveProject = Project & { raw: ReadonlySignal<RawActiveProject> };
export type InactiveProject = Project & { raw: ReadonlySignal<RawInactiveProject> };

export const Project = createModel(($raw: RawProject, lifter: Lifter) => {
  const raw = signal($raw);
  const id = computed(() => raw.value.id);
  const name = computed(() => raw.value.name);
  const active = computed(() => raw.value.active);

  effect(() => {
    raw.value;
    lifter.change();
  });

  return {
    raw: readonly(raw),
    id,
    name,
    active,
    setName(name: string) {
      raw.value = { ...raw.value, name };
    },
    toRaw(): RawProject {
      return raw.value;
    },
    toJSON(): unknown {
      return this.toRaw();
    },
  };
});

export const PROJECTS = (() => {
  function createInactiveDuplicateImpl(name: string, models: RawProjectModels, lifter: Lifter) {
    return new Project(
      {
        v: PROJECT_VERSION,
        id: id(),
        name: `Copy of ${name}`,
        active: false,
        models,
      },
      lifter,
    );
  }

  return {
    from(raw: RawProject | V0_RawProject, lifter: Lifter) {
      return new Project(upgradeRawProject(raw), lifter);
    },

    inactiveToActiveAndModels(project: InactiveProject, lifter: Lifter) {
      const { models, ...raw } = project.raw.value;
      const active = new Project({ ...raw, active: true }, lifter);
      return { active, models };
    },

    activeToInactive(project: ActiveProject, models: RawProjectModels, lifter: Lifter) {
      return new Project({ ...project.toRaw(), active: false, models }, lifter);
    },

    createInactiveDuplicate(
      project: Project,
      getActiveModels: () => RawProjectModels,
      lifter: Lifter,
    ) {
      const raw = project.raw.value;
      if (raw.active) {
        return createInactiveDuplicateImpl(raw.name, getActiveModels(), lifter);
      } else {
        return createInactiveDuplicateImpl(raw.name, raw.models, lifter);
      }
    },
  };
})();

 */
