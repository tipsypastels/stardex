import * as v from "valibot";
import { makeId } from "../../utils/id";
import { V0_RawProject, V0_upgradeRawProject } from "./versioned/v0";
import { V1_RawProject, V1_upgradeRawProject } from "./versioned/v1";
import { V2_RawProject, V2_RawProjectModels } from "./versioned/v2";

/* -------------------------------------------------------------------------- */
/*                                     Raw                                    */
/* -------------------------------------------------------------------------- */

export const PROJECT_VERSION = 2;

export type RawProjectModels = v.InferOutput<typeof RawProjectModels>;
export type RawProject = v.InferOutput<typeof RawProject>;
export { V2_RawProject as RawProject, V2_RawProjectModels as RawProjectModels };

// prettier-ignore
export const VAny_RawProject = v.union([
  V2_RawProject,
  v.pipe(V1_RawProject, v.transform(V1_upgradeRawProject)),
  v.pipe(V0_RawProject, v.transform(V0_upgradeRawProject), v.transform(V1_upgradeRawProject)),
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
      id: makeId(),
      name: `Copy of ${name}`,
      dormantModels,
    });
  }

  function makeDuplicate(project: Project, getActiveModels: () => RawProjectModels) {
    return makeDuplicateImpl(project.name, project.dormantModels ?? getActiveModels());
  }

  return { make, makeDuplicate };
})();
