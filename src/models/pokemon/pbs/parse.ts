import type { RawBuiltinPokemon, RawPokemon } from "..";
import { id } from "../../../state/id";
import { capitalize } from "../../../utils/string";
import { compareTypeKeysUnordered } from "../../type/key_pair";
import { POKEMON_VERSION } from "../../versioned";
import { SPECIES } from "../species";

export interface InputPBSFile {
  name: string;
  text: string;
}

export function parsePBSFiles(files: InputPBSFile[]) {
  const builder = new Builder();

  for (const file of files) {
    const lines = file.text.split("\n");

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex].trim().replace(/\s*#.*$/, "");
      if (line.length === 0 || line.startsWith("#")) {
        continue;
      }

      let heading: RegExpMatchArray | null;
      let kv: RegExpMatchArray | null;

      if ((heading = line.match(/^\[\s*(.*)\s*\]$/))) {
        builder.entry(heading[1], file.name, lineIndex);
      } else if ((kv = line.match(/^\s*(\w+)\s*=\s*(.*)$/))) {
        const key = kv[1].toLowerCase();
        const value = kv[2];

        switch (key) {
          case "name": {
            builder.name(value, file.name);
            break;
          }
          case "types": {
            builder.types(value, file.name);
            break;
          }
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
  fileName: string;
  startLineIndex: number;
}

class Builder {
  #entries: Entry[] = [];
  #current?: Entry;

  entry(essentialsId: string, fileName: string, startLineIndex: number) {
    this.#flush();
    this.#current = { essentialsId, fileName, startLineIndex };
  }

  name(name: string, fileName: string) {
    this.#ensureCurrent(fileName).name = name;
  }

  types(types: string, fileName: string) {
    this.#ensureCurrent(fileName).types = types;
  }

  finish() {
    this.#flush();

    const pokemons: RawPokemon[] = [];
    const errors: PBSError[] = [];

    for (const entry of this.#entries) {
      // This is a form, ignore it.
      if (entry.essentialsId.match(/,\d+$/)) {
        continue;
      }

      const name = entry.name ?? capitalize(entry.essentialsId);
      const key = makeKey(entry.essentialsId, name);
      const species = SPECIES.tryOf(key);
      const types = entry.types?.toLowerCase().split(/\s*,\s*/);

      if (species) {
        const pokemon: RawBuiltinPokemon = {
          v: POKEMON_VERSION,
          id: id(),
          species: key,
        };
        if (types && !compareTypeKeysUnordered(types, species.typeKeys)) {
          pokemon.types = types;
        }
        pokemons.push(pokemon);
      } else if (types) {
        pokemons.push({ v: POKEMON_VERSION, id: id(), name, types });
      } else {
        errors.push(new PBSMissingTypesError(entry));
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

  #ensureCurrent(fileName: string) {
    if (!this.#current) throw new PBSMissingSectionError(fileName);
    return this.#current;
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Error                                   */
/* -------------------------------------------------------------------------- */

export class PBSAggregateError extends AggregateError {
  get name() {
    return this.constructor.name;
  }

  get errors(): PBSError[] {
    return super.errors;
  }
}

export abstract class PBSError extends Error {
  readonly fileName: string;
  readonly lineIndex: number;

  constructor(fileName: string, lineIndex: number) {
    super();
    this.fileName = fileName;
    this.lineIndex = lineIndex;
  }

  get name() {
    return this.constructor.name;
  }
}

export class PBSMissingTypesError extends PBSError {
  readonly essentialsId: string;

  constructor(entry: Entry) {
    super(entry.fileName, entry.startLineIndex);
    this.essentialsId = entry.essentialsId;
  }
}

export class PBSMissingSectionError extends PBSError {
  constructor(fileName: string) {
    super(fileName, 0);
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
