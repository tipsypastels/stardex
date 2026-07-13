import type { RawPokemon } from "..";
import { capitalize } from "../../../utils/string";
import { compareTypeKeysUnordered } from "../../type/key_pair";
import { POKEMON_VERSION } from "../../versioned";
import { SPECIES } from "../species";

export function parsePBSFile(text: string) {
  const lines = text.split("\n");
  const builder = new Builder();

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim().replace(/\s*#.*$/, "");
    if (line.length === 0 || line.startsWith("#")) {
      continue;
    }

    let heading: RegExpMatchArray | null;
    let kv: RegExpMatchArray | null;

    if ((heading = line.match(/^\[\s*(.*)\s*\]$/))) {
      builder.entry(heading[1], lineIndex);
    } else if ((kv = line.match(/^\s*(\w+)\s*=\s*(.*)$/))) {
      const key = kv[1].toLowerCase();
      const value = kv[2];

      switch (key) {
        case "name": {
          builder.name(value);
          break;
        }
        case "types": {
          builder.types(value);
          break;
        }
      }
    }
  }

  return builder.finish();
}

interface Entry {
  essentialsId: string;
  name?: string;
  types?: string;
  startLineIndex: number;
}

class Builder {
  #entries: Entry[] = [];
  #current?: Entry;

  entry(essentialsId: string, startLineIndex: number) {
    this.#flush();
    this.#current = { essentialsId, startLineIndex };
  }

  name(name: string) {
    this.#ensureCurrent().name = name;
  }

  types(types: string) {
    this.#ensureCurrent().types = types;
  }

  finish() {
    this.#flush();

    const pokemons: RawPokemon[] = [];
    const errors: PBSParseError[] = [];

    for (const entry of this.#entries) {
      const name = entry.name ?? capitalize(entry.essentialsId);
      const key = makeKey(entry.essentialsId, name);
      const species = SPECIES.tryOf(key);
      const types = entry.types?.toLowerCase().split(/\s*,\s*/);

      if (species) {
        const typesIfDifferent =
          types && !compareTypeKeysUnordered(types, species.typeKeys) ? types : undefined;

        pokemons.push({ v: POKEMON_VERSION, species: key, types: typesIfDifferent });
      } else if (types) {
        pokemons.push({ v: POKEMON_VERSION, key, name, types });
      } else {
        errors.push(
          this.error(`Pokémon [${entry.essentialsId}] is missing Types=`, entry.startLineIndex),
        );
      }
    }

    if (errors.length > 0) {
      throw new PBSAggregateError(errors);
    }

    return pokemons;
  }

  #flush() {
    if (this.#current) this.#entries.push(this.#current);
  }

  #ensureCurrent() {
    return (
      this.#current ||
      this.throw("Expected a section at the start of the file, e.g. [BULBASAUR]", 0)
    );
  }

  throw(message: string, lineIndex: number): never {
    throw this.error(message, lineIndex);
  }

  error(message: string, lineIndex: number) {
    return new PBSParseError(message, lineIndex);
  }
}

export class PBSAggregateError extends AggregateError {
  get errors(): PBSParseError[] {
    return super.errors;
  }
}

export class PBSParseError extends Error {
  readonly lineIndex: number;
  constructor(message: string, lineIndex: number) {
    super(message);
    this.lineIndex = lineIndex;
  }
}

const TROUBLESOME_IDS: Record<string, string> = {
  NIDORANfE: "nidoran-f",
  NIDORANmA: "nidoran-m",
  FLABEBE: "flabebe",
};

// We can't convert the essentials IDs to keys because they're MRMIME format.
function makeKey(essentialsId: string, name: string) {
  return (
    TROUBLESOME_IDS[essentialsId] ||
    name
      .toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll(/[^a-z0-9-]/g, "")
  );
}
