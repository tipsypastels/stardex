import type { ProjectsData } from "$lib/models2/project";

export interface StateDataV1 {
  version: 1;
  projects: ProjectsData;
}
