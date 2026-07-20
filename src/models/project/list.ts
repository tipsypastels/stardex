import { batch, createEffect, createMemo, createRoot, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import * as v from "valibot";
import { PROJECTS, RawProject, RawProjectModels, type ProjectWithDormantModels } from ".";
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
import { catchInitialValidationError } from "../ui/error/validation";
import { PROJECT_LIST_VERSION, PROJECT_VERSION } from "./versioned";

export type RawProjectList = v.InferOutput<typeof RawProjectList>;
export const RawProjectList = v.object({
  v: v.literal(PROJECT_VERSION),
  all: v.array(RawProject),
  activeId: v.string(),
});

export const PROJECT_LISTS = (() => {
  const defaults: RawProjectList = {
    v: PROJECT_LIST_VERSION,
    all: [{ v: PROJECT_VERSION, id: "default", name: "Untitled Project 1" }],
    activeId: "default",
  };

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

      const [all, setAll] = createStore(defaults.all.map(PROJECTS.make));
      const [activeId, setActiveId] = createSignal(defaults.activeId);
      const active = createMemo(() => all.find((project) => project.id === activeId())!);

      const caught = catchInitialValidationError(() => {
        const raw_ = store.load();
        if (!raw_) return;

        const raw = v.parse(RawProjectList, raw_);

        setAll(raw.all.map(PROJECTS.make));
        setActiveId(raw.activeId);
      });

      if (!caught) {
        createEffect(() => {
          store.dump({
            v: PROJECT_LIST_VERSION,
            all: [...all],
            activeId: activeId(),
          });
        });
      }

      function findIndex(id: string) {
        return mustIndex(
          all.findIndex((p) => p.id === id),
          `Can't find project with ID ${id}`,
        );
      }

      return {
        all,

        get activeId() {
          return activeId();
        },

        get active() {
          return active();
        },

        setName(id: string, name: string) {
          setAll((project) => project.id === id, "name", name);
        },

        setActive(id: string) {
          if (id === activeId()) {
            return;
          }

          const oldActiveId = activeId();
          const oldActiveIndex = findIndex(oldActiveId);
          const oldModels = getModels();

          const newActiveIndex = findIndex(id);
          const { dormantModels: newModels, ...newActive } = all[
            newActiveIndex
          ] as ProjectWithDormantModels;

          batch(() => {
            setAll(oldActiveIndex, "dormantModels", oldModels);
            setAll(newActiveIndex, newActive);
            setActiveId(id);
            setModels(newModels);
          });
        },

        pushEmpty() {
          setAll(
            all.length,
            PROJECTS.make({
              v: PROJECT_VERSION,
              id: id(),
              name: `Untitled Project ${all.length + 1}`,
              dormantModels: {
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
          const duplicate = PROJECTS.makeDuplicate(project, getModels);

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
