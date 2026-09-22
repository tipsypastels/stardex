import type { RawPokemon } from "..";
import { iterMap } from "../../../utils/collection/iter";
import type { Spanned } from "../../../utils/span";
import { capitalize, capitalizeWords } from "../../../utils/string";
import { pokemons } from "../list";
import { SPECIES } from "../species";
import { transformAltNameWithAliases } from "./alt_name";
import { PLVT_AFTER_ENTRIES, PLVT_BEFORE_ALL, type PokemonListVerbatimText } from "./verbatim";

export interface SerializePokemonListToTextOptions {
  eachId?(id: Spanned<string>): void;
}

export function serializePokemonListToText({ eachId }: SerializePokemonListToTextOptions = {}) {
  return serializeRawPokemonListToText({
    pokemons: iterMap(pokemons.all, (pokemon) => pokemon.toRaw()),
    verbatimText: pokemons.verbatimText,
    eachId,
  });
}

export interface SerializeRawPokemonListToTextOptions {
  pokemons: Iterable<RawPokemon>;
  verbatimText?: PokemonListVerbatimText;
  eachId?(id: Spanned<string>): void;
}

export function serializeRawPokemonListToText({
  pokemons,
  verbatimText,
  eachId,
}: SerializeRawPokemonListToTextOptions) {
  const buffer = new SpannedLineBuffer(eachId);
  const iter = pokemons[Symbol.iterator]();

  if (verbatimText && verbatimText[PLVT_BEFORE_ALL].length > 0) {
    buffer.unspanned(verbatimText[PLVT_BEFORE_ALL]);
  }

  for (let i = 0; ; i++) {
    const result = iter.next();
    if (result.done) break;

    const pokemon = result.value;
    buffer.spanned(pokemon.id, serializePokemon(pokemon));

    const verbatimLinesAfter = verbatimText?.[PLVT_AFTER_ENTRIES]?.[i];
    if (verbatimLinesAfter) {
      buffer.unspanned(verbatimLinesAfter);
    }
  }

  return buffer.finish();
}

function serializePokemon(pokemon: RawPokemon) {
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
  if (pokemon.comment) {
    line += ` # ${pokemon.comment}`;
  }

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

class SpannedLineBuffer {
  #eachId?: (id: Spanned<string>) => void;

  #lines: string[] = [];
  #length = 0;

  constructor(eachId?: (id: Spanned<string>) => void) {
    this.#eachId = eachId;
  }

  unspanned(lines: string[]) {
    for (const line of lines) {
      this.#lines.push(line);
      this.#length += line.length + 1;
    }
  }

  spanned(id: string, line: string) {
    this.#eachId?.({ value: id, from: this.#length, to: this.#length + line.length });
    this.#lines.push(line);
    this.#length += line.length + 1;
  }

  finish() {
    return this.#lines.join("\n");
  }
}
