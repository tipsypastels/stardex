import { useModel } from "@preact/signals";
import { createContext, type ComponentChildren } from "preact";
import { POKEDEX_FORMATS, PokedexFormat } from "../models/pokedex_format";
import { POKEMON_LISTS, PokemonList } from "../models/pokemon_list";
import { REGION_SETS, RegionSet } from "../models/region_set";
import { Strictness, STRICTNESSES } from "../models/strictness";

export const PokemonsContext = createContext({} as PokemonList);
export const RegionsContext = createContext({} as RegionSet);
export const StrictnessContext = createContext({} as Strictness);
export const PokedexFormatContext = createContext({} as PokedexFormat);

export interface ModelsProps {
  children: ComponentChildren;
}

export function Models({ children }: ModelsProps) {
  const pokemons = useModel(() => POKEMON_LISTS.initial());
  const regions = useModel(() => REGION_SETS.initial());
  const strictness = useModel(() => STRICTNESSES.initial());
  const pokedexFormat = useModel(() => POKEDEX_FORMATS.initial());

  return (
    <PokemonsContext.Provider value={pokemons}>
      <RegionsContext.Provider value={regions}>
        <StrictnessContext.Provider value={strictness}>
          <PokedexFormatContext.Provider value={pokedexFormat}>
            {children}
          </PokedexFormatContext.Provider>
        </StrictnessContext.Provider>
      </RegionsContext.Provider>
    </PokemonsContext.Provider>
  );
}
