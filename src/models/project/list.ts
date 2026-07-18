import { batch, createEffect, createMemo, createRoot } from "solid-js";
import { createStore, produce } from "solid-js/store";
import * as v from "valibot";
import {
  ACTIVE_PROJECTS,
  INACTIVE_PROJECTS,
  PROJECTS,
  RawProject,
  RawProjectModels,
  VAny_RawProject,
  type ActiveProject,
  type InactiveProject,
} from ".";
import { mustIndex } from "../../utils/assert";
import { id } from "../../utils/id";
import { stored } from "../../utils/storage";
import { POKEDEX_MODES, pokedexMode } from "../pokedex/mode";
import {
  CUSTOM_ICONS_METADATA_VERSION,
  customIconsMetadata,
} from "../pokemon/custom_icon/metadata";
import { pokemons } from "../pokemon/list";
import { POKEMON_LIST_VERSION } from "../pokemon/versioned";
import { REGIONS } from "../region";
import { regions } from "../region/set";
import { strictness, STRICTNESSES } from "../strictness";
import { EXCLUDED_TYPES_VERSION, excludedTypes } from "../type/excluded";
import { PROJECT_VERSION } from "./versioned";

export const PROJECT_LISTS = (() => {
  const defaults: RawProject[] = [
    {
      v: PROJECT_VERSION,
      id: "default",
      name: "Untitled Project 1",
      active: true,
    },
  ];

  function getModels(): RawProjectModels {
    return {
      pokemons: pokemons.toRaw(),
      regions: regions.toRaw(),
      strictness: strictness.key,
      pokedexMode: pokedexMode.key,
      customIconsMetadata: customIconsMetadata.toRaw(),
      excludedTypes: excludedTypes.toRaw(),
    };
  }

  function setModels(models: RawProjectModels) {
    batch(() => {
      pokemons.setFromRaw(models.pokemons);
      regions.set(models.regions);
      strictness.key = models.strictness;
      pokedexMode.key = models.pokedexMode;
      customIconsMetadata.setFromRaw(models.customIconsMetadata);
      excludedTypes.setFromRaw(models.excludedTypes);
    });
  }

  function initial() {
    return createRoot(() => {
      const store = stored("stardex_projects");
      const initial = v
        .parse(v.array(VAny_RawProject), store.load() ?? defaults)
        .map(PROJECTS.make);

      const [all, setAll] = createStore(initial);
      const activeIndex = createMemo(() => all.findIndex((p) => p.active));
      const active = createMemo(() => all[activeIndex()] as ActiveProject);

      createEffect(() => {
        store.dump([...all]);
      });

      function findIndex(id: string) {
        return mustIndex(
          all.findIndex((p) => p.id === id),
          `Can't find project with ID ${id}`,
        );
      }

      return {
        all,

        get active() {
          return active();
        },

        setName(id: string, name: string) {
          setAll((project) => project.id === id, "name", name);
        },

        setActive(id: string) {
          if (id === active().id) {
            return;
          }

          const index = findIndex(id);
          const project = all[index] as InactiveProject;

          const oldModels = getModels();
          const { active: newActive, models: newModels } =
            INACTIVE_PROJECTS.toActiveAndModels(project);

          batch(() => {
            setAll(
              produce((all) => {
                all[activeIndex()] = ACTIVE_PROJECTS.toInactive(active(), oldModels);
                all[index] = newActive;
              }),
            );
            setModels(newModels);
          });
        },

        pushEmpty() {
          setAll(
            all.length,
            INACTIVE_PROJECTS.make({
              v: PROJECT_VERSION,
              id: id(),
              name: `Untitled Project ${all.length}`,
              active: false,
              models: {
                pokemons: { v: POKEMON_LIST_VERSION, all: [] },
                regions: REGIONS.recommendedKeys,
                strictness: STRICTNESSES.defaultKey,
                pokedexMode: POKEDEX_MODES.defaultKey,
                customIconsMetadata: { v: CUSTOM_ICONS_METADATA_VERSION, pokemonIds: [] },
                excludedTypes: { v: EXCLUDED_TYPES_VERSION, all: [] },
              },
            }),
          );
        },

        pushDuplicate(id: string) {
          const index = findIndex(id);
          const project = all[index];
          const duplicate = PROJECTS.makeInactiveDuplicate(project, getModels);

          setAll(
            produce((all) => {
              all.splice(index + 1, 0, duplicate);
            }),
          );
        },

        delete(id: string) {
          setAll((all) => all.filter((project) => project.id !== id));
        },
      };
    });
  }

  return { initial };
})();

export const projects = PROJECT_LISTS.initial();
