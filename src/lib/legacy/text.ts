import { ALL_SPECIES, resolveSpecies } from "$lib/models/species";
import { capitalize } from "$lib/utils/strings";
import { resolvePokemonKey, resolvePokemonName, type Pokemon } from "../models/pokemon";

export function legacyTextFromPokemonList(pokemon: Pokemon[]) {
  const lines: string[] = [];

  for (const mon of pokemon) {
    if (mon.newlinesBefore) {
      lines.push(...new Array(mon.newlinesBefore).fill(""));
    }

    if (mon.comment) {
      lines.push(...mon.comment.split("\n").map((c) => `# ${c}`));
    }

    let line = resolvePokemonName(mon);

    if (mon.type) {
      line += ` (${mon.type.map(capitalize).join("/")})`;
    }

    if (mon.exclude) {
      line += ` @exclude`;
    }

    lines.push(line);
  }

  const lastMon = pokemon.at(-1);
  if (lastMon && lastMon.newlinesAfterIfLast) {
    lines.push(...new Array(lastMon.newlinesAfterIfLast).fill(""));
  }

  return lines.join("\n");
}

export function legacyTextToPokemonList(text: string) {
  const pokemon: Pokemon[] = [];
  const pokemonKeysToLineNos = new Map<string, number>();
  const errors: LegacyTextParseError[] = [];
  const lines = new SpannedString(text).lines();

  function pushError(token: SpannedString, message: string, severity?: "warning" | "error") {
    errors.push(new LegacyTextParseError(token, message, severity));
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
    let type: string[] | undefined;

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
          type = token.value
            .toLowerCase()
            .replaceAll(/[()]/g, "")
            .split(/\s*\/\s*/)
            .filter((s) => !!s);

          if (type.length === 0) {
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
    let mon: Pokemon;

    if (species) {
      mon = { species };
      if (type) mon.type = type;
    } else {
      if (!type) {
        pushError(line, "Custom Pokémon must specify types.");
        continue eachLine;
      }
      const key = name.toLowerCase().replace(" ", "-");
      mon = { key, name, type };
    }

    const key = resolvePokemonKey(mon);
    const duplicateOfLineNo = pokemonKeysToLineNos.get(key);
    if (typeof duplicateOfLineNo !== "undefined") {
      pushError(line, `Duplicate listing, already on line ${lineNo}.`);
      continue eachLine;
    }
    pokemonKeysToLineNos.set(key, lineNo);

    if (exclude) {
      mon.exclude = true;
    }
    if (commentBeforeNext.length > 0) {
      mon.comment = commentBeforeNext.join("\n");
      commentBeforeNext = [];
    }
    if (newlinesBeforeNext > 0) {
      mon.newlinesBefore = newlinesBeforeNext;
      newlinesBeforeNext = 0;
    }

    pokemon.push(mon);
  }

  if (newlinesBeforeNext > 0) {
    const lastMon = pokemon.at(-1);
    if (lastMon) {
      lastMon.newlinesAfterIfLast = newlinesBeforeNext;
    }
  }

  return { pokemon, errors };
}

const KEY_ALIASES: Record<string, string> = {
  "nidoran male": "nidoran-m",
  "nidoran female": "nidoran-f",
  "mime junior": "mime-jr",
  mimejunior: "mime-jr",
};

function resolveSpeciesByKeyOrName(pat: string) {
  pat = pat.toLowerCase();
  pat = pat in KEY_ALIASES ? KEY_ALIASES[pat] : pat;
  return (
    resolveSpecies(pat) ||
    resolveSpecies(pat.replace(" ", "-")) ||
    ALL_SPECIES.find((s) => s.nameLower === pat) ||
    ALL_SPECIES.find((s) => s.nameLower.replace(" ", "") === pat)
  );
}

export class LegacyTextParseError {
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
