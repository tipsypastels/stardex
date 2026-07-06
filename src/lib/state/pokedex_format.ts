import { PokedexFormat } from "$lib/models/pokedex_format";
import { persistedWritable } from "$lib/utils/stores";

export const pokedexFormat = persistedWritable({
  key: "stardex_pokedex_format",
  default: () => PokedexFormat.DEFAULT,
  load: (key) => PokedexFormat.of(key),
});
