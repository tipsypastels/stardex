import * as v from "valibot";
import { PokemonListVerbatimText } from "../../text/verbatim";
import { V1_RawPokemon } from "../v1";

export const V2_RawPokemonList = v.object({
  v: v.literal(2),
  all: v.array(V1_RawPokemon),
  verbatimText: PokemonListVerbatimText,
});
