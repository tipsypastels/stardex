import { createModel, effect } from "@preact/signals";
import { getCustomIconDbEntries } from "../../../state/database";
import type { PokedexMode } from "../../pokedex/mode";
import type { ProjectList } from "../../project/list";
import type { CustomIconsMetadata } from "./metadata";

export type CustomIcons = InstanceType<typeof CustomIcons>;

export const CustomIcons = createModel(
  (metadata: CustomIconsMetadata, projects: ProjectList, mode: PokedexMode) => {
    effect(() => {
      const projectId = projects.active.value.id.value;
      if (metadata.pokemonKeys.value.size > 0 && mode.key.value === "icons") {
        getCustomIconDbEntries(projectId, (entries) => {
          console.log(entries);
        });
      }
    });

    return {};
  },
);
