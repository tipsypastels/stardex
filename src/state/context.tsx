import { useModel } from "@preact/signals";
import { createContext, type ComponentChildren } from "preact";
import { Metrics } from "../models/metrics";
import { POKEDEX_MODES, PokedexMode } from "../models/pokedex/mode";
import { CustomIcons } from "../models/pokemon/custom_icon";
import { CUSTOM_ICONS_METADATAS } from "../models/pokemon/custom_icon/metadata";
import { POKEMON_LISTS, PokemonList } from "../models/pokemon/list";
import { PROJECT_LISTS, ProjectList } from "../models/project/list";
import { REGION_SETS, RegionSet } from "../models/region/set";
import { Strictness, STRICTNESSES } from "../models/strictness";

export const PokemonsContext = createContext({} as PokemonList);
export const RegionsContext = createContext({} as RegionSet);
export const StrictnessContext = createContext({} as Strictness);
export const PokedexModeContext = createContext({} as PokedexMode);
export const ProjectsContext = createContext({} as ProjectList);
export const MetricsContext = createContext({} as Metrics);
export const CustomIconsContext = createContext({} as CustomIcons);

export interface ModelsProps {
  children: ComponentChildren;
}

export function Models({ children }: ModelsProps) {
  const pokemons = useModel(() => POKEMON_LISTS.initial());
  const regions = useModel(() => REGION_SETS.initial());
  const strictness = useModel(() => STRICTNESSES.initial());
  const pokedexMode = useModel(() => POKEDEX_MODES.initial());
  const customIconsMetadata = useModel(() => CUSTOM_ICONS_METADATAS.initial());

  const projects = useModel(() =>
    PROJECT_LISTS.initial(
      () => ({
        pokemons: pokemons.toRaw(),
        regions: regions.toRaw(),
        strictness: strictness.key.value,
        pokedexMode: pokedexMode.key.value,
        customIconsMetadata: customIconsMetadata.toRaw(),
      }),
      (models) => {
        pokemons.setFromRaw(models.pokemons);
        regions.set(models.regions);
        strictness.key.value = models.strictness;
        pokedexMode.key.value = models.pokedexMode;
        customIconsMetadata.setFromRaw(models.customIconsMetadata);
      },
    ),
  );

  const metrics = useModel(() => new Metrics(pokemons, regions, strictness));
  const customIcons = useModel(() => new CustomIcons(customIconsMetadata, projects, pokedexMode));

  return (
    // When in hell, do as the demons do.
    <PokemonsContext.Provider value={pokemons}>
      <RegionsContext.Provider value={regions}>
        <StrictnessContext.Provider value={strictness}>
          <PokedexModeContext.Provider value={pokedexMode}>
            <ProjectsContext.Provider value={projects}>
              <MetricsContext.Provider value={metrics}>
                <CustomIconsContext.Provider value={customIcons}>
                  {children}
                </CustomIconsContext.Provider>
              </MetricsContext.Provider>
            </ProjectsContext.Provider>
          </PokedexModeContext.Provider>
        </StrictnessContext.Provider>
      </RegionsContext.Provider>
    </PokemonsContext.Provider>
  );
}
