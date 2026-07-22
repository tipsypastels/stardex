import type { RawPokemon } from "..";
import type { Spanned } from "../../../utils/span";
import { capitalize, capitalizeWords } from "../../../utils/string";
import { SPECIES } from "../species";
import { pokemonListTextDiffIsTrivial, readPokemonListTextDiff } from "./diff";

export interface SerializePokemonListToTextOptions {
  pokemons: Iterable<RawPokemon>;
  textDiff?: string[];
  strict?: boolean;
  eachId?(id: Spanned<string>): void;
}

export function serializePokemonListToText({
  pokemons,
  textDiff,
  strict,
  eachId,
}: SerializePokemonListToTextOptions) {
  const lines: string[] = [];
  const idSpans = new IdSpanTracker(eachId);

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
          idSpans.blank(entry.count);
          break;
        }
        case "entries": {
          for (let i = 0; i < entry.count; i++) {
            const pokemon = readOne();
            if (!pokemon) break;
            lines.push(toLine(pokemon, idSpans));
          }
          break;
        }
        case "entry-with-verbatim-suffix": {
          const pokemon = readOne();
          if (!pokemon) break;
          lines.push(toLine(pokemon, idSpans, entry.suffix));
          break;
        }
        case "verbatim": {
          lines.push(entry.line);
          idSpans.ignore(entry.line.length);
          break;
        }
      }
    }
    if (strict && !pokemonsIter.next().done) {
      throw new Error("Pokemon list length exceeded text diff entry count");
    }
  } else {
    for (const pokemon of pokemons) {
      lines.push(toLine(pokemon, idSpans));
    }
  }

  return lines.join("\n");
}

function toLine(pokemon: RawPokemon, idSpans: IdSpanTracker, verbatimSuffix?: string) {
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

  idSpans.track(pokemon.id, line.length);

  return line;
}

class IdSpanTracker {
  #eachId?: (id: Spanned<string>) => void;

  #lineStartIndex = 0;

  constructor(eachId?: (id: Spanned<string>) => void) {
    this.#eachId = eachId;
  }

  blank(length: number) {
    this.#lineStartIndex += length;
  }

  ignore(length: number) {
    this.#lineStartIndex += length + 1;
  }

  track(id: string, length: number) {
    this.#eachId?.({ value: id, from: this.#lineStartIndex, to: this.#lineStartIndex + length });
    this.#lineStartIndex += length + 1;
  }
}
