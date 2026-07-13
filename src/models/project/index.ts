import { createModel, effect, signal } from "@preact/signals";
import { readonly, type Lifter } from "../../utils/signal";
import type { PokedexModeKey } from "../pokedex/mode";
import type { RawCustomIconsMetadata } from "../pokemon/custom_icon/metadata";
import type { RawPokemonList } from "../pokemon/list";
import type { RegionKey } from "../region";
import type { StrictnessKey } from "../strictness";
import { PROJECT_VERSION, upgradeRawActiveProject, upgradeRawInactiveProject } from "../versioned";
import type { V0_RawActiveProject, V0_RawInactiveProject, V0_RawProject } from "../versioned/v0";

/* -------------------------------------------------------------------------- */
/*                                     Raw                                    */
/* -------------------------------------------------------------------------- */

export interface RawProjectModels {
  pokemons: RawPokemonList;
  regions: RegionKey[];
  strictness: StrictnessKey;
  pokedexMode: PokedexModeKey;
  customIconsMetadata: RawCustomIconsMetadata;
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

/* -------------------------------------------------------------------------- */
/*                                   Shared                                   */
/* -------------------------------------------------------------------------- */

export type Project = ActiveProject | InactiveProject;

export const PROJECTS = (() => {
  function from(raw: RawProject | V0_RawProject, lifter: Lifter) {
    return raw.active ? ACTIVE_PROJECTS.from(raw, lifter) : INACTIVE_PROJECTS.from(raw, lifter);
  }
  return { from };
})();

/* -------------------------------------------------------------------------- */
/*                               Active Project                               */
/* -------------------------------------------------------------------------- */

export type ActiveProject = InstanceType<typeof ActiveProject>;

export const ActiveProject = createModel((raw: RawActiveProject, lifter: Lifter) => {
  const id = signal(raw.id);
  const name = signal(raw.name);

  effect(() => {
    name.value;
    lifter.change();
  });

  return {
    id: readonly(id),
    name,
    createInactiveDuplicate(getActiveModels: () => RawProjectModels) {
      return createInactiveDuplicate(name.value, getActiveModels(), lifter);
    },
    toInactive(models: RawProjectModels) {
      return new InactiveProject({ ...this.toRaw(), active: false, models }, lifter);
    },
    toRaw(): RawActiveProject {
      return {
        ...raw,
        name: name.value,
      };
    },
    toJSON(): unknown {
      return this.toRaw();
    },
  };
});

export const ACTIVE_PROJECTS = (() => {
  function from(raw: RawActiveProject | V0_RawActiveProject, lifter: Lifter) {
    return new ActiveProject(upgradeRawActiveProject(raw), lifter);
  }
  return { from };
})();

/* -------------------------------------------------------------------------- */
/*                              Inactive Project                              */
/* -------------------------------------------------------------------------- */

export type InactiveProject = InstanceType<typeof InactiveProject>;

export const InactiveProject = createModel((raw: RawInactiveProject, lifter: Lifter) => {
  const id = signal(raw.id);
  const name = signal(raw.name);

  effect(() => {
    name.value;
    lifter.change();
  });

  return {
    id: readonly(id),
    name,
    createInactiveDuplicate() {
      return createInactiveDuplicate(name.value, raw.models, lifter);
    },
    toActiveAndModels() {
      const { models, ...raw } = this.toRaw();
      const active = new ActiveProject({ ...raw, active: true }, lifter);
      return { active, models };
    },
    toRaw(): RawInactiveProject {
      return {
        ...raw,
        name: name.value,
      };
    },
    toJSON(): unknown {
      return this.toRaw();
    },
  };
});

export const INACTIVE_PROJECTS = (() => {
  function from(raw: RawInactiveProject | V0_RawInactiveProject, lifter: Lifter) {
    return new InactiveProject(upgradeRawInactiveProject(raw), lifter);
  }
  return { from };
})();

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function createInactiveDuplicate(name: string, models: RawProjectModels, lifter: Lifter) {
  return new InactiveProject(
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
