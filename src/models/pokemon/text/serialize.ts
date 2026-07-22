import type { RawPokemon } from "..";
import { capitalize, capitalizeWords } from "../../../utils/string";
import { SPECIES } from "../species";
import { pokemonListTextDiffIsTrivial, readPokemonListTextDiff } from "./diff";

export interface SerializePokemonListToTextOptions {
  pokemons: Iterable<RawPokemon>;
  textDiff?: string[];
  strict?: boolean;
}

export function serializePokemonListToText({
  pokemons,
  textDiff,
  strict,
}: SerializePokemonListToTextOptions) {
  const lines: string[] = [];

  if (textDiff && !pokemonListTextDiffIsTrivial(textDiff)) {
    const pokemonsIter = pokemons[Symbol.iterator]();

    function readOne() {
      const result = pokemonsIter.next();
      if (result.done) {
        if (strict) throw new Error("Text diff entry count exceeded Pokemon list length");
        return;
      }
      return result.value;
    }

    for (const entry of readPokemonListTextDiff(textDiff)) {
      switch (entry.type) {
        case "blanks": {
          lines.push(...new Array(entry.count).map(() => ""));
          break;
        }
        case "entries": {
          for (let i = 0; i < entry.count; i++) {
            const pokemon = readOne();
            if (!pokemon) break;
            lines.push(toLine(pokemon));
          }
          break;
        }
        case "entry-with-verbatim-suffix": {
          const pokemon = readOne();
          if (!pokemon) break;
          lines.push(toLine(pokemon, entry.suffix));
          break;
        }
        case "verbatim": {
          lines.push(entry.line);
          break;
        }
      }
    }
    if (strict && !pokemonsIter.next().done) {
      throw new Error("Pokemon list length exceeded text diff entry count");
    }
  } else {
    for (const pokemon of pokemons) {
      lines.push(toLine(pokemon));
    }
  }

  return lines.join("\n");
}

function toLine(pokemon: RawPokemon, verbatimSuffix?: string) {
  let line = "species" in pokemon ? SPECIES.of(pokemon.species).name : pokemon.name;

  const altName = (() => {
    if ("species" in pokemon) {
      if (pokemon.customAltName) return pokemon.customAltName;
      if (pokemon.alt) return SPECIES.of(pokemon.species).getAlt(pokemon.alt).name;
    } else {
      return pokemon.altName;
    }
  })();

  if (altName || pokemon.types) {
    line += " (";
    if (altName) {
      line += `${capitalizeWords(altName)}:`;
    }
    // TODO: If the type can be parsed as an altname
    // with the known alt type hack, disambiguate it with :.
    // Only applies to a single type for builtin mons.
    if (pokemon.types) {
      line += pokemon.types.map(capitalize).join("/");
    }
    line += ")";
  }
  if (pokemon.exclude) {
    line += " @exclude";
  }
  if (verbatimSuffix) {
    line += ` ${verbatimSuffix}`;
  }
  return line;
}
