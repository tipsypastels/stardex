import { Projects, type ProjectModelStateData } from "$lib/models/project";
import { persistedWritable, reducible } from "$lib/utils/stores";
import { derived, get, writable } from "svelte/store";
import { pokemons } from "./pokemons";
import { regions } from "./regions";
import { strictness } from "./strictness";
import { pokedexFormat } from "./pokedex_format";
import { Strictness } from "$lib/models/strictness";
import { PokedexFormat } from "$lib/models/pokedex_format";

export const projects = reducible(
  persistedWritable({
    key: "stardex_projects",
    default: () => Projects.default(),
    load: (data) => Projects.from(data),
  }),
  (store) => {
    function getModelStateData(): ProjectModelStateData {
      return {
        pokemons: get(pokemons).toJson(),
        regions: get(regions).toJson(),
        strictness: get(strictness).toJson(),
        pokedexFormat: get(pokedexFormat).toJson(),
      };
    }
    return {
      get active() {
        return derived(store, ($projects) => $projects.active);
      },
      setActive(id: string) {
        let newModelStateData: ProjectModelStateData | undefined;

        store.update(($projects) => {
          const result = $projects.setActive(id, getModelStateData());
          newModelStateData = result.modelStateData;
          return result.projects;
        });

        // If this turns out to be an issue, make a one-time subscriber and set it there.
        if (!newModelStateData) {
          throw new Error("Svelte did not run project store update synchronously.");
        }

        pokemons.set(newModelStateData.pokemons);
        regions.set(newModelStateData.regions);
        strictness.set(Strictness.of(newModelStateData.strictness));
        pokedexFormat.set(PokedexFormat.of(newModelStateData.pokedexFormat));
      },
      setName(id: string, name: string) {
        store.update(($projects) => $projects.setName(id, name));
      },
      pushEmpty() {
        store.update(($projects) => $projects.pushEmpty());
      },
      pushDuplicate(id: string) {
        store.update(($projects) => $projects.pushDuplicate(id, getModelStateData));
      },
      delete(id: string) {
        store.update(($projects) => $projects.delete(id));
      },
    };
  },
);

export const projectsModalOpen = writable(false);
