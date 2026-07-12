import { createModel, effect, signal } from "@preact/signals";
import { Set as ISet } from "immutable";
import { getCustomIcons as getCustomIconsDbEntries } from "../../state/database";
import { stored } from "../../utils/storage";
import type { ProjectList } from "../project/list";
import { CUSTOM_ICON_SET_VERSION } from "../versioned";

const store = stored<RawCustomIconSet, DumpedSet>("stardex_custom_icons");

export interface RawCustomIconSet {
  v: typeof CUSTOM_ICON_SET_VERSION;
  pokemonKeys: string[];
}

interface DumpedSet {
  v: typeof CUSTOM_ICON_SET_VERSION;
  pokemonKeys: ISet<string>;
}

export type CustomIconSet = InstanceType<typeof CustomIconSet>;

export const CustomIconSet = createModel(($raw: RawCustomIconSet, projects: ProjectList) => {
  const pokemonKeys = signal(ISet($raw.pokemonKeys));

  effect(() => {
    store.dump({
      v: CUSTOM_ICON_SET_VERSION,
      pokemonKeys: pokemonKeys.value,
    });
  });

  effect(() => {
    if (pokemonKeys.value.size > 0) {
      console.log("querying");
      getCustomIconsDbEntries((dbEntries) => {
        console.log(dbEntries);
      });
    }
  });

  return {
    setFromRaw(raw: RawCustomIconSet) {
      pokemonKeys.value = ISet(raw.pokemonKeys);
    },
    toRaw(): RawCustomIconSet {
      return {
        v: CUSTOM_ICON_SET_VERSION,
        pokemonKeys: pokemonKeys.value.toArray(),
      };
    },
    toJSON(): unknown {
      return this.toRaw();
    },
  };
});

export const CUSTOM_ICON_SETS = (() => {
  function initial(projects: ProjectList) {
    return new CustomIconSet(
      store.load() ?? { v: CUSTOM_ICON_SET_VERSION, pokemonKeys: [] },
      projects,
    );
  }
  return { initial };
})();
