import * as v from "valibot";
import { RawPokemonListVerbatimText } from "../../text/verbatim";
import { V1_RawPokemon } from "../pokemon/v1";

export const V2_RawPokemonList = v.object({
  v: v.literal(2),
  all: v.array(V1_RawPokemon),
  verbatimText: RawPokemonListVerbatimText,
});
