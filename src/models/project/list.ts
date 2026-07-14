import { computed, createModel, effect, signal } from "@preact/signals";
import { List as IList } from "immutable";
import { assert } from "../../utils/assert";
import { makeLifter, type Lifter } from "../../utils/signal";
import { stored } from "../../utils/storage";
import { POKEDEX_MODES } from "../pokedex/mode";
import {
  Project,
  PROJECTS,
  type ActiveProject,
  type InactiveProject,
  type RawProject,
  type RawProjectModels,
} from "../project";
import { REGIONS } from "../region";
import { STRICTNESSES } from "../strictness";
import {
  CUSTOM_ICONS_METADATA_VERSION,
  EXCLUDED_TYPES_VERSION,
  POKEMON_LIST_VERSION,
  PROJECT_VERSION,
} from "../versioned";

export const store = stored<RawProject[], IList<Project>>("stardex_projects");

export type ProjectList = InstanceType<typeof ProjectList>;

export const ProjectList = createModel(
  (
    $all: Project[],
    getModels: () => RawProjectModels,
    setModels: (models: RawProjectModels) => void,
    lifter: Lifter,
  ) => {
    const all = signal(IList($all));
    const activeIndex = computed(() => all.value.findIndex((p) => p.active.value));
    const active = computed(() => all.value.get(activeIndex.value) as ActiveProject);

    function onChange() {
      store.dump(all.value);
    }

    effect(onChange);
    lifter.onChange(onChange);

    function findIndex(id: string) {
      const index = all.value.findIndex((p) => p.id.value === id);
      assert(index > -1, `Can't find project with ID ${id}`);
      return index;
    }

    return {
      all,
      active,
      setActive(id: string) {
        if (id === active.value.id.value) {
          return;
        }

        const index = findIndex(id);
        const project = all.value.get(index) as InactiveProject;

        const oldModels = getModels();
        const { active: newActive, models: newModels } = PROJECTS.inactiveToActiveAndModels(
          project,
          lifter,
        );

        all.value = all.value.withMutations((list) => {
          list
            .set(activeIndex.value, PROJECTS.activeToInactive(active.value, oldModels, lifter))
            .set(index, newActive);
        });

        setModels(newModels);
      },
      pushEmpty() {
        all.value = all.value.push(
          new Project(
            {
              v: PROJECT_VERSION,
              id: crypto.randomUUID(),
              name: `Untitled Project ${all.value.size + 1}`,
              active: false,
              models: {
                pokemons: { v: POKEMON_LIST_VERSION, all: [] },
                regions: REGIONS.recommendedKeys,
                strictness: STRICTNESSES.defaultKey,
                pokedexMode: POKEDEX_MODES.defaultKey,
                customIconsMetadata: { v: CUSTOM_ICONS_METADATA_VERSION, pokemonKeys: [] },
                excludedTypes: { v: EXCLUDED_TYPES_VERSION, all: [] },
              },
            },
            lifter,
          ),
        );
      },
      pushDuplicate(id: string) {
        const index = findIndex(id);
        const project = all.value.get(index)!;
        const duplicate = PROJECTS.createInactiveDuplicate(project, getModels, lifter);
        all.value = all.value.insert(index + 1, duplicate);
      },
      delete(id: string) {
        assert(id !== active.value.id.value, "Can't delete the active project");
        all.value = all.value.delete(findIndex(id));
      },
      toRaw() {
        return all.value.map((p) => p.toRaw()).toArray();
      },
    };
  },
);

export const PROJECT_LISTS = (() => {
  const defaults: RawProject[] = [
    {
      v: PROJECT_VERSION,
      id: "default",
      name: "Untitled Project 1",
      active: true,
    },
  ];

  function initial(
    getModels: () => RawProjectModels,
    setModels: (models: RawProjectModels) => void,
  ) {
    const lifter = makeLifter();
    const projects = (store.load() ?? defaults).map((raw) => PROJECTS.from(raw, lifter));
    return new ProjectList(projects, getModels, setModels, lifter);
  }
  return { initial };
})();
