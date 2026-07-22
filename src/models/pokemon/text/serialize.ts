import type { RawPokemon } from "..";
import { iterMap } from "../../../utils/iter";
import type { Spanned } from "../../../utils/span";
import { capitalize, capitalizeWords } from "../../../utils/string";
import { pokemons } from "../list";
import { SPECIES } from "../species";
import { transformAltNameWithAliases } from "./alt_name";
import { pokemonListTextDiffIsTrivial, readPokemonListTextDiff } from "./diff";

export interface SerializePokemonListToTextOptions {
  eachId?(id: Spanned<string>): void;
}

export function serializePokemonListToText({ eachId }: SerializePokemonListToTextOptions = {}) {
  return serializeRawPokemonListToText({
    pokemons: iterMap(pokemons.all, (pokemon) => pokemon.toRaw()),
    textDiff: pokemons.textDiff,
    eachId,
  });
}

export interface SerializeRawPokemonListToTextOptions {
  pokemons: Iterable<RawPokemon>;
  textDiff?: string[];
  strict?: boolean;
  eachId?(id: Spanned<string>): void;
}

export function serializeRawPokemonListToText({
  pokemons,
  textDiff,
  strict,
  eachId,
}: SerializeRawPokemonListToTextOptions) {
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
    if (pokemon.types) {
      if (mustDisambiguateSingleTypeForKnownAltTypeHack(pokemon)) {
        line += ":";
      }

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

function mustDisambiguateSingleTypeForKnownAltTypeHack(pokemon: RawPokemon) {
  return (
    "species" in pokemon &&
    pokemon.types?.length === 1 &&
    SPECIES.of(pokemon.species).alts.length > 0 &&
    pokemon.types[0] !== transformAltNameWithAliases(pokemon.species, pokemon.types[0])
  );
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
