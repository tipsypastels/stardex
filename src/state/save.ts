import { batch } from "@preact/signals";
import { useContext } from "preact/hooks";
import type { RawSave } from "../models/save";
import { SAVE_VERSION, upgradeRawSave } from "../models/versioned";
import type { V0_RawSave } from "../models/versioned/v0";
import {
  CustomIconsContext,
  PokedexModeContext,
  PokemonsContext,
  ProjectsContext,
  RegionsContext,
  StrictnessContext,
} from "./context";

export interface Saver {
  make(): RawSave;
  load(save: RawSave | V0_RawSave): void;
}

export function useSaver(): Saver {
  const pokemons = useContext(PokemonsContext);
  const regions = useContext(RegionsContext);
  const strictness = useContext(StrictnessContext);
  const pokedexMode = useContext(PokedexModeContext);
  const projects = useContext(ProjectsContext);
  const customIcons = useContext(CustomIconsContext);

  return {
    make() {
      return {
        v: SAVE_VERSION,
        projectName: projects.active.value.name.value,
        pokemons: pokemons.toRaw(),
        regions: regions.toRaw(),
        strictness: strictness.key.value,
        pokedexMode: pokedexMode.key.value,
        customIcons: customIcons.toRawSaved(),
      };
    },
    load(save_) {
      const save = upgradeRawSave(save_);
      if (save.v !== SAVE_VERSION) {
        alert("Invalid save data!");
        return;
      }

      batch(() => {
        if (save.projectName && projects.active.value.name.value.includes("Untitled")) {
          projects.active.value.setName(save.projectName);
        }

        pokemons.setFromRaw(save.pokemons);
        regions.set(save.regions);
        strictness.key.value = save.strictness;
        pokedexMode.key.value = save.pokedexMode;
        customIcons.setFromRawSaved(save.customIcons);
      });
    },
  };
}
