import { computed, createModel, signal } from "@preact/signals";
import { List as IList } from "immutable";
import { assert } from "../utils/assert";
import { POKEDEX_FORMATS } from "./pokedex_format";
import { ActiveProject, InactiveProject, type Project, type RawProjectModels } from "./project";
import { REGIONS } from "./region";
import { STRICTNESSES } from "./strictness";
import { PROJECT_VERSION } from "./versioned";

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
              pokeedexFormat: POKEDEX_FORMATS.defaultKey,
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
      toJSON(): unknown {
        return this.toRaw();
      },
    };
  },
);
