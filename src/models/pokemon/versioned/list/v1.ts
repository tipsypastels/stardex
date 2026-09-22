import * as v from "valibot";
import { PokemonListVerbatimTextBuilder } from "../../text/verbatim";
import { V1_RawPokemon } from "../v1";
import type { V2_RawPokemonList } from "./v2";

/**
 * Pokemon List V1:
 * - Used textDiff system instead of newer verbatimText.
 */

export const V1_RawPokemonList = v.object({
  v: v.literal(1),
  all: v.array(V1_RawPokemon),
  textDiff: v.optional(v.array(v.string())),
});

export function V1_upgradeRawPokemonList(
  raw: v.InferOutput<typeof V1_RawPokemonList>,
): v.InferOutput<typeof V2_RawPokemonList> {
  const all: v.InferOutput<typeof V1_RawPokemon>[] = [];
  const verbatimText = new PokemonListVerbatimTextBuilder();

  for (const pokemon of raw.all) {
    all.push({ ...pokemon });
  }

  if (raw.textDiff) {
    let entryCount = 0;

    for (const textDiffEntry of raw.textDiff) {
      if (textDiffEntry.startsWith("\0e")) {
        const count = +textDiffEntry.slice(2);
        entryCount += count;
        for (let i = 0; i < count; i++) verbatimText.entry();
      } else if (textDiffEntry.startsWith("\0w")) {
        const suffix = textDiffEntry.slice(2);
        const comment = suffix.replace(/^\s*#\s*/, "");

        const pokemon = all.at(entryCount);
        if (pokemon) pokemon.comment = comment;
        entryCount++;
        verbatimText.entry();
      } else if (textDiffEntry.startsWith("\0b")) {
        const count = +textDiffEntry.slice(2);
        for (let i = 0; i < count; i++) verbatimText.verbatim("");
      } else {
        verbatimText.verbatim(textDiffEntry);
      }
    }
  }

  return { v: 2, all, verbatimText: verbatimText.finish() };
}
