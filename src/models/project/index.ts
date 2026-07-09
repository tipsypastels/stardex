import { createModel, signal } from "@preact/signals";
import { readonly } from "../../utils/signal";
import type { PokedexFormatKey } from "../pokedex/format";
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
  pokedexFormat: PokedexFormatKey;
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
  function from(raw: RawProject | V0_RawProject) {
    return raw.active ? ACTIVE_PROJECTS.from(raw) : INACTIVE_PROJECTS.from(raw);
  }
  return { from };
})();

/* -------------------------------------------------------------------------- */
/*                               Active Project                               */
/* -------------------------------------------------------------------------- */

export type ActiveProject = InstanceType<typeof ActiveProject>;

export const ActiveProject = createModel((raw: RawActiveProject) => {
  const id = signal(raw.id);
  const name = signal(raw.name);

  return {
    id: readonly(id),
    name,
    isActive(): this is ActiveProject {
      return true;
    },
    isInactive(): this is InactiveProject {
      return false;
    },
    createInactiveDuplicate(getActiveModels: () => RawProjectModels) {
      return createInactiveDuplicate(name.value, getActiveModels());
    },
    toInactive(models: RawProjectModels) {
      return new InactiveProject({
        ...this.toRaw(),
        active: false,
        models,
      });
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
  function from(raw: RawActiveProject | V0_RawActiveProject) {
    return new ActiveProject(upgradeRawActiveProject(raw));
  }
  return { from };
})();

/* -------------------------------------------------------------------------- */
/*                              Inactive Project                              */
/* -------------------------------------------------------------------------- */

export type InactiveProject = InstanceType<typeof InactiveProject>;

export const InactiveProject = createModel((raw: RawInactiveProject) => {
  const id = signal(raw.id);
  const name = signal(raw.name);

  return {
    id: readonly(id),
    name,
    isActive(): this is ActiveProject {
      return false;
    },
    isInactive(): this is InactiveProject {
      return true;
    },
    createInactiveDuplicate() {
      return createInactiveDuplicate(name.value, raw.models);
    },
    toActiveAndModels() {
      const { models, ...raw } = this.toRaw();
      const active = new ActiveProject({ ...raw, active: true });
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
  function from(raw: RawInactiveProject | V0_RawInactiveProject) {
    return new InactiveProject(upgradeRawInactiveProject(raw));
  }
  return { from };
})();

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function createInactiveDuplicate(name: string, models: RawProjectModels) {
  return new InactiveProject({
    v: PROJECT_VERSION,
    id: crypto.randomUUID(),
    name: `Copy of ${name}`,
    active: false,
    models,
  });
}
