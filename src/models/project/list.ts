import { computed, createModel, effect, signal } from "@preact/signals";
import { List as IList } from "immutable";
import { assert } from "../../utils/assert";
import { stored } from "../../utils/storage";
import { POKEDEX_FORMATS } from "../pokedex/format";
import {
  ActiveProject,
  InactiveProject,
  PROJECTS,
  type Project,
  type RawProject,
  type RawProjectModels,
} from "../project";
import { REGIONS } from "../region";
import { STRICTNESSES } from "../strictness";
import { PROJECT_VERSION } from "../versioned";

export const store = stored<RawProject[], IList<Project>>("stardex_projects");

export type ProjectList = InstanceType<typeof ProjectList>;

export const ProjectList = createModel(
  (
    $all: Project[],
    getModels: () => RawProjectModels,
    setModels: (models: RawProjectModels) => void,
  ) => {
    const all = signal(IList($all));
    const activeIndex = computed(() => all.value.findIndex((p) => p.isActive()));
    const active = computed(() => all.value.get(activeIndex.value) as ActiveProject);

    effect(() => {
      store.dump(all.value);
    });

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
        const { active: newActive, models: newModels } = project.toActiveAndModels();

        all.value = all.value.withMutations((list) => {
          list.set(activeIndex.value, active.value.toInactive(oldModels)).set(index, newActive);
        });

        setModels(newModels);
      },
      pushEmpty() {
        all.value = all.value.push(
          new InactiveProject({
            v: PROJECT_VERSION,
            id: crypto.randomUUID(),
            name: `Untitled Project ${all.value.size}`,
            active: false,
            models: {
              pokemons: [],
              regions: REGIONS.recommendedKeys,
              strictness: STRICTNESSES.defaultKey,
              pokedexFormat: POKEDEX_FORMATS.defaultKey,
            },
          }),
        );
      },
      pushDuplicate(id: string) {
        const index = findIndex(id);
        const project = all.value.get(index)!;
        const duplicate = project.createInactiveDuplicate(getModels);
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
    const projects = (store.load() ?? defaults).map(PROJECTS.from);
    return new ProjectList(projects, getModels, setModels);
  }
  return { initial };
})();
