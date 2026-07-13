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
    const errors: PBSError[] = [];

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
        errors.push(new MissingTypesError(entry.essentialsId, entry.startLineIndex));
      }
    }

    if (errors.length > 0) {
      throw new MultiError(errors);
    }

    return pokemons;
  }

  #flush() {
    if (this.#current) this.#entries.push(this.#current);
  }

  #ensureCurrent() {
    if (!this.#current) throw new MissingSectionError();
    return this.#current;
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Error                                   */
/* -------------------------------------------------------------------------- */

export abstract class PBSError {
  abstract toHTML(): string;

  get name() {
    return this.constructor.name;
  }
}

class MultiError extends PBSError {
  readonly errors: PBSError[];

  constructor(errors: PBSError[]) {
    super();
    this.errors = errors;
  }

  toHTML() {
    return this.errors.map((error) => error.toHTML()).join("<br />");
  }
}

abstract class SingleError extends PBSError {
  readonly lineIndex: number;

  constructor(lineIndex: number) {
    super();
    this.lineIndex = lineIndex;
  }
}

class MissingTypesError extends SingleError {
  readonly essentialsId: string;

  constructor(essentialsId: string, lineIndex: number) {
    super(lineIndex);
    this.essentialsId = essentialsId;
  }

  toHTML() {
    return `- Pokémon <strong>[${this.essentialsId}]</strong> is missing Types= at line <strong>${this.lineIndex}</strong>.`;
  }
}

class MissingSectionError extends SingleError {
  constructor() {
    super(0);
  }

  toHTML() {
    return `- Expected a section, e.g. <strong>[BULBASAUR]</strong> at line <strong>${this.lineIndex}</strong>.`;
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Keys                                    */
/* -------------------------------------------------------------------------- */

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
