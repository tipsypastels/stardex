import { useModel } from "@preact/signals";
import { createContext, type ComponentChildren } from "preact";
import { Metrics } from "../models/metrics";
import { POKEDEX_FORMATS, PokedexFormat } from "../models/pokedex/format";
import { POKEMON_LISTS, PokemonList } from "../models/pokemon/list";
import { PROJECT_LISTS, ProjectList } from "../models/project/list";
import { REGION_SETS, RegionSet } from "../models/region/set";
import { Strictness, STRICTNESSES } from "../models/strictness";

export const PokemonsContext = createContext({} as PokemonList);
export const RegionsContext = createContext({} as RegionSet);
export const StrictnessContext = createContext({} as Strictness);
export const PokedexFormatContext = createContext({} as PokedexFormat);
export const ProjectsContext = createContext({} as ProjectList);
export const MetricsContext = createContext({} as Metrics);

export interface ModelsProps {
  children: ComponentChildren;
}

export function Models({ children }: ModelsProps) {
  const pokemons = useModel(() => POKEMON_LISTS.initial());
  const regions = useModel(() => REGION_SETS.initial());
  const strictness = useModel(() => STRICTNESSES.initial());
  const pokedexFormat = useModel(() => POKEDEX_FORMATS.initial());

  const projects = useModel(() =>
    PROJECT_LISTS.initial(
      () => ({
        pokemons: pokemons.toRaw(),
        regions: regions.toRaw(),
        strictness: strictness.key.value,
        pokedexFormat: pokedexFormat.key.value,
      }),
      (models) => {
        pokemons.setFromRaw(models.pokemons);
        regions.set(models.regions);
        strictness.key.value = models.strictness;
        pokedexFormat.key.value = models.pokedexFormat;
      },
    ),
  );

  const metrics = useModel(() => new Metrics(pokemons, regions, strictness));

  return (
    // When in hell, do as the demons do.
    <PokemonsContext.Provider value={pokemons}>
      <RegionsContext.Provider value={regions}>
        <StrictnessContext.Provider value={strictness}>
          <PokedexFormatContext.Provider value={pokedexFormat}>
            <ProjectsContext.Provider value={projects}>
              <MetricsContext.Provider value={metrics}>{children}</MetricsContext.Provider>
            </ProjectsContext.Provider>
          </PokedexFormatContext.Provider>
        </StrictnessContext.Provider>
      </RegionsContext.Provider>
    </PokemonsContext.Provider>
  );
}
