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
  const lines: string[] = [];
  const idSpans = new IdSpanTracker(eachId);
  const iter = pokemons[Symbol.iterator]();

  if (verbatimText && verbatimText[PLVT_BEFORE_ALL].length > 0) {
    lines.push(...verbatimText[PLVT_BEFORE_ALL]);
  }

  for (let i = 0; ; i++) {
    const result = iter.next();
    if (result.done) break;

    const pokemon = result.value;
    pushPokemonLines(lines, pokemon, idSpans);

    const verbatimLinesAfter = verbatimText?.[PLVT_AFTER_ENTRIES]?.[i];
    if (verbatimLinesAfter) {
      lines.push(...verbatimLinesAfter);
    }
  }

  return lines.join("\n");
}

function pushPokemonLines(lines: string[], pokemon: RawPokemon, idSpans: IdSpanTracker) {
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

  idSpans.track(pokemon.id, line.length);

  lines.push(line);
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
