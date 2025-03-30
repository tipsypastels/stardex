const POKEDEX_FORMAT_MAP = {
  icons: {
    name: "Icons",
    description: "Display your Pokédex as party icons.",
  },
  names: {
    name: "Names",
    description: "Display your Pokédex as a list of names.",
  },
};

export type PokedexFormat = keyof typeof POKEDEX_FORMAT_MAP;
export const POKEDEX_FORMATS = Object.keys(
  POKEDEX_FORMAT_MAP,
) as PokedexFormat[];

export function getPokedexFormatName(f: PokedexFormat) {
  return POKEDEX_FORMAT_MAP[f].name;
}

export function getPokedexFormatDescription(f: PokedexFormat) {
  return POKEDEX_FORMAT_MAP[f].description;
}
