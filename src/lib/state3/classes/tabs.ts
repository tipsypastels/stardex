import type { PokedexFormat } from "$lib/models/pokedex_format";
import type { Pokemon } from "$lib/models/pokemon";
import type { RegionKey } from "$lib/models/region";
import type { Strictness } from "$lib/models/strictness";
import { derived, get, type Readable, type Updater, type Writable } from "svelte/store";
import { Set as ISet } from "immutable";

export interface TabData {
  name: string;
  pokemon: Pokemon[];
  pokedexFormat: PokedexFormat;
  regions: RegionKey[];
  strictness: Strictness;
}

export interface TabState extends Omit<TabData, "regions"> {
  regions: ISet<RegionKey>;
  active: boolean;
}

export class TabsState implements Readable<TabState[]> {
  #dataStore: Writable<TabData[]>;
  #indexStore: Writable<number>;

  #allStore: Readable<TabState[]>;
  #currentStore: Readable<TabState>;

  constructor(dataStore: Writable<TabData[]>, indexStore: Writable<number>) {
    this.#dataStore = dataStore;
    this.#indexStore = indexStore;

    this.#allStore = derived([dataStore, indexStore], ([$data, $index]) =>
      $data.map((t, i) => ({ ...t, regions: ISet(t.regions), active: i === $index })),
    );
    this.#currentStore = derived([dataStore, indexStore], ([$data, $index]) => ({
      ...$data[$index],
      regions: ISet($data[$index].regions),
      active: true,
    }));
  }

  get subscribe() {
    return this.#allStore.subscribe;
  }

  get current() {
    return this.#currentStore;
  }

  writableTabKey<K extends keyof TabState>(key: K): Writable<TabState[K]> {
    const { subscribe } = derived(this.current, ($t) => $t[key]);

    const update = (f: Updater<TabData[K]>) => {
      const index = get(this.#indexStore);
      this.#dataStore.update(($data) => {
        const $newValue = f($data[index][key]);
        const $newData = [...$data];

        $newData[index] = {
          ...$newData[index],
          [key]: $newValue,
        };

        return $newData;
      });
    };

    return {
      subscribe,
      set(value) {
        update(() => value);
      },
      update,
    };
  }
}
