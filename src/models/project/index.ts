import { computed, createModel, effect, signal, type ReadonlySignal } from "@preact/signals";
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
        id: crypto.randomUUID(),
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
