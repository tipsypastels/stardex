import type { PokedexModeKey } from "./pokedex/mode";
import type { CustomIconLoadedEntry } from "./pokemon/custom_icon";
import type { RawPokemonList } from "./pokemon/list";
import type { RegionKey } from "./region";
import type { StrictnessKey } from "./strictness";
import type { SAVE_VERSION } from "./versioned";

export interface RawSave {
  v: typeof SAVE_VERSION;
  projectName?: string;
  pokemons: RawPokemonList;
  regions: RegionKey[];
  strictness: StrictnessKey;
  pokedexMode: PokedexModeKey;
  customIcons: RawSavedCustomIcons;
}

export interface RawSavedCustomIcons {
  all: Record<string, CustomIconLoadedEntry>;
}
