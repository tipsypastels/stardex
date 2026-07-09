import type { RawPokemon } from "../models/pokemon";
import { SPECIES } from "../models/pokemon/species";
import { POKEMON_VERSION } from "../models/versioned";
import { capitalize } from "../utils/string";

export function textPokedexFromRawPokemons(pokemons: Iterable<RawPokemon>) {
  const lines: string[] = [];
  let last: RawPokemon | undefined;

  for (const pokemon of pokemons) {
    last = pokemon;

    if (pokemon.newlinesBefore) {
      lines.push(...new Array(pokemon.newlinesBefore).fill(""));
    }

    if (pokemon.comment) {
      lines.push(...pokemon.comment.split("\n").map((c) => `# ${c}`));
    }

    let line = "species" in pokemon ? SPECIES.of(pokemon.species).name : pokemon.name;

    if (pokemon.types) {
      line += ` (${pokemon.types.map(capitalize).join("/")})`;
    }

    if (pokemon.exclude) {
      line += ` @exclude`;
    }

    lines.push(line);
  }

  if (last && last.newlinesAfterIfLast) {
    lines.push(...new Array(last.newlinesAfterIfLast).fill(""));
  }

  return lines.join("\n");
}

export function textPokedexToRawPokemons(text: string) {
  const pokemons: RawPokemon[] = [];
  const pokemonKeysToLineNos = new Map<string, number>();
  const errors: TextPokedexParseError[] = [];
  const lines = new SpannedString(text).lines();

  function pushError(token: SpannedString, message: string, severity?: "warning" | "error") {
    errors.push(new TextPokedexParseError(token, message, severity));
  }

  let commentBeforeNext: string[] = [];
  let newlinesBeforeNext = 0;

  eachLine: for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const line = lines[lineNo].trim();

    if (line.value.length === 0) {
      newlinesBeforeNext++;
      continue;
    }

    if (line.value.startsWith("#")) {
      commentBeforeNext.push(line.value.replace(/^#\s*/, ""));
      continue;
    }

    const tokens = line.tokens();

    let name = "";
    let exclude = false;
    let types: string[] | undefined;

    let buildingName = true;

    for (const token of tokens) {
      if (token.value.startsWith("@") || token.value.startsWith("(")) {
        buildingName = false;
      }
      if (buildingName) {
        if (name.length > 0) name += " ";
        name += token.value;
      } else {
        if (token.value.startsWith("@")) {
          if (token.value === "@exclude" || token.value === "@ignore") {
            exclude = true;
          } else if (token.value === "@alt" || token.value === "@filler") {
            // TODO: Implement?
            pushError(
              token,
              `The ${token.value} modifier from old Stardex is not currently supported.`,
              "warning",
            );
          } else {
            pushError(token, "Unknown modifier.", "error");
            continue eachLine;
          }
        } else if (token.value.startsWith("(")) {
          types = token.value
            .toLowerCase()
            .replaceAll(/[()]/g, "")
            .split(/\s*\/\s*/)
            .filter((s) => !!s);

          if (types.length === 0) {
            pushError(token, "Type list may not be empty.");
            continue eachLine;
          }
        } else {
          pushError(token, "Could not parse token.");
          continue eachLine;
        }
      }
    }

    const species = resolveSpeciesByKeyOrName(name);
    let pokemon: RawPokemon;

    if (species) {
      pokemon = { v: POKEMON_VERSION, species: species.key };
      if (types) pokemon.types = types;
    } else {
      if (!types) {
        pushError(line, "Custom Pokémon must specify types.");
        continue eachLine;
      }
      const key = name.toLowerCase().replace(" ", "-");
      pokemon = { v: POKEMON_VERSION, key, name, types };
    }

    const key = species?.key ?? (pokemon as { key: string }).key;
    const duplicateOfLineNo = pokemonKeysToLineNos.get(key);
    if (typeof duplicateOfLineNo !== "undefined") {
      pushError(line, `Duplicate listing, already on line ${lineNo}.`);
      continue eachLine;
    }
    pokemonKeysToLineNos.set(key, lineNo);

    if (exclude) {
      pokemon.exclude = true;
    }
    if (commentBeforeNext.length > 0) {
      pokemon.comment = commentBeforeNext.join("\n");
      commentBeforeNext = [];
    }
    if (newlinesBeforeNext > 0) {
      pokemon.newlinesBefore = newlinesBeforeNext;
      newlinesBeforeNext = 0;
    }

    pokemons.push(pokemon);
  }

  if (newlinesBeforeNext > 0) {
    const last = pokemons.at(-1);
    if (last) {
      last.newlinesAfterIfLast = newlinesBeforeNext;
    }
  }

  return { pokemons, errors };
}

const KEY_ALIASES: Record<string, string> = {
  "nidoran male": "nidoran-m",
  "nidoran female": "nidoran-f",
  "mime junior": "mime-jr",
  "mimejunior": "mime-jr",
};

function resolveSpeciesByKeyOrName(pat: string) {
  pat = pat.toLowerCase();
  pat = pat in KEY_ALIASES ? KEY_ALIASES[pat] : pat;
  return (
    SPECIES.tryOf(pat) ||
    SPECIES.tryOf(pat.replace(" ", "-")) ||
    SPECIES.all.find((s) => s.nameLower === pat) ||
    SPECIES.all.find((s) => s.nameLower.replace(" ", "") === pat)
  );
}

export class TextPokedexParseError {
  #span: SpannedString;
  readonly message: string;
  readonly severity: "warning" | "error";

  constructor(span: SpannedString, message: string, severity: "warning" | "error" = "error") {
    this.#span = span;
    this.message = message;
    this.severity = severity;
  }

  get from() {
    return this.#span.offset;
  }

  get to() {
    return this.#span.offset + this.#span.value.length;
  }
}

class SpannedString {
  readonly value: string;
  readonly offset: number;

  constructor(value: string, offset = 0) {
    this.value = value;
    this.offset = offset;
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

        const string = new SpannedString(s, offset);
        return { output: output.concat(string), offset: offset + s.length };
      },
      {
        output: [] as SpannedString[],
        offset: this.offset,
      },
    ).output;
  }
}
