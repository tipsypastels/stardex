import type { RawPokemon } from "..";
import { POKEMON_VERSION } from "../../versioned";
import { SPECIES } from "../species";
import { PokemonListTextDiffBuilder } from "./diff";

export function parsePokemonListText(text: string) {
  const pokemons: RawPokemon[] = [];
  const pokemonKeysToLineIndices = new Map<string, number>();
  const textDiff = new PokemonListTextDiffBuilder();
  const errors: PokemonListTextParseError[] = [];
  const lines = new SpannedString(text).lines();

  lines: for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim();

    if (line.value.length === 0) {
      textDiff.blank(1);
      continue;
    }
    if (line.value.startsWith("#")) {
      textDiff.verbatim(line.value);
      continue;
    }

    let name = "";
    let exclude = false;
    let types: string[] = [];
    let wants: "name" | "extras" = "name";

    const error = (
      ctor: new (line: SpannedString, token?: SpannedString) => PokemonListTextParseError,
      token?: SpannedString,
    ) => {
      const error = new ctor(line, token);
      errors.push(error);
      if (error.severity === "error") {
        textDiff.verbatim(line.value);
      }
    };

    for (const token of line.tokens()) {
      if (token.value.startsWith("@") || token.value.startsWith("(")) {
        wants = "extras";
      }

      if (wants === "name") {
        if (name.length > 0) {
          name += " ";
        }
        name += token.value;
        continue;
      }

      if (token.value === "@exclude" || token.value === "@ignore") {
        exclude = true;
      } else if (token.value === "@alt" || token.value === "@filler") {
        error(UnimplementedLegacyModifier, token);
      } else if (token.value.startsWith("@")) {
        error(UnknownModifier, token);
      } else if (token.value.startsWith("(")) {
        types = token.value
          .toLowerCase()
          .replaceAll(/[()]/g, "")
          .split(/\s*\/\s*/)
          .filter((s) => !!s);

        if (types.length === 0) {
          error(EmptyTypeList, token);
          continue lines;
        }
      } else {
        error(UnknownToken, token);
        continue lines;
      }
    }

    const species = SPECIES.search(name);
    const pokemon: RawPokemon | undefined = (() => {
      if (species) {
        const pokemon: RawPokemon = { v: POKEMON_VERSION, species: species.key };
        if (types.length > 0) {
          pokemon.types = types;
        }
        return pokemon;
      } else {
        if (types.length === 0) {
          error(CustomMissingTypes);
          return;
        }

        const key = name.toLowerCase().replace(" ", "-");
        return { v: POKEMON_VERSION, key, name, types };
      }
    })();
    if (!pokemon) {
      continue lines;
    }

    const key = species?.key || (pokemon as { key: string }).key;
    const lineIndexOfSame = pokemonKeysToLineIndices.get(key);

    if (typeof lineIndexOfSame !== "undefined") {
      error(DuplicateListing);
      continue lines;
    }

    pokemonKeysToLineIndices.set(key, lineIndex);

    if (exclude) {
      pokemon.exclude = true;
    }

    pokemons.push(pokemon);
    textDiff.entry();
  }

  return {
    pokemons,
    errors,
    textDiff: textDiff.finish(),
  };
}

/* -------------------------------------------------------------------------- */
/*                                    Error                                   */
/* -------------------------------------------------------------------------- */

export abstract class PokemonListTextParseError {
  abstract message: string;
  protected line: SpannedString;
  protected token?: SpannedString;

  constructor(line: SpannedString, token?: SpannedString) {
    this.line = line;
    this.token = token;
  }

  get severity(): "warning" | "error" {
    return "error";
  }

  get kind() {
    return this.constructor.name;
  }
}

class CustomMissingTypes extends PokemonListTextParseError {
  get message() {
    return `missing types`;
  }
}

class UnimplementedLegacyModifier extends PokemonListTextParseError {
  get message() {
    return "unimplemented legacy modifier";
  }

  get severity() {
    return "warning" as const;
  }
}

class UnknownModifier extends PokemonListTextParseError {
  get message() {
    return "unknown modifier";
  }

  get severity() {
    return "warning" as const;
  }
}

class EmptyTypeList extends PokemonListTextParseError {
  get message() {
    return "empty type list";
  }
}

class UnknownToken extends PokemonListTextParseError {
  get message() {
    return "unknown token";
  }
}

class DuplicateListing extends PokemonListTextParseError {
  get message() {
    return "duplicate";
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Span                                    */
/* -------------------------------------------------------------------------- */

class SpannedString {
  readonly value: string;
  readonly offset: number;
  readonly index: number;

  constructor(value: string, offset = 0, index = 0) {
    this.value = value;
    this.offset = offset;
    this.index = index;
  }

  lines() {
    return this.#split(/(\n)/);
  }

  tokens() {
    return this.#split(/(\s+)/);
  }

  trim() {
    const trimmedStart = this.value.trimStart();
    const offset = this.offset + (this.value.length - trimmedStart.length);
    return new SpannedString(this.value.trim(), offset);
  }

  // Must be called with regexes containing the pattern in a capture group, e.g.
  // /(\s+)/, so that the length of the delimiters can be used in the offset math.
  #split(pattern: RegExp) {
    return this.value.split(pattern).reduce(
      ({ output, offset }, s, i) => {
        // This is a delimiter.
        if (i % 2 !== 0) {
          return { output, offset: offset + s.length };
        }

        const string = new SpannedString(s, offset, i / 2);
        return { output: output.concat(string), offset: offset + s.length };
      },
      {
        output: [] as SpannedString[],
        offset: this.offset,
      },
    ).output;
  }
}
