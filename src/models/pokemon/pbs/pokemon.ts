import type { RawBuiltinPokemon, RawPokemon } from "..";
import type { NamedText } from "../../../utils/fs/named_text";
import { makeId } from "../../../utils/id";
import { SPECIES } from "../species";
import { POKEMON_VERSION } from "../versioned";
import type { PBSForm } from "./form";
import { parsePBSAsRecords } from "./parse";
import { getPBSRecordTypeKeys } from "./type";

export interface PBSPokemon {
  section: string;
  speciesName: string;
  evolvesToSections?: string[];
  raw: RawPokemon;
  /** May have holes, represent as undefined. */
  forms: (PBSForm | undefined)[];
}

export function parsePBSAsPokemons(file: NamedText, out: Map<string, PBSPokemon>) {
  const { records, errors } = parsePBSAsRecords(file);

  for (const record of records) {
    const speciesName = record.fields.name;
    if (!speciesName) {
      errors.push({
        fileName: file.name,
        lineIndex: record.sectionLineIndex,
        message: "Expected a Name field.",
      });
      continue;
    }

    const species = SPECIES.tryOf(getSpeciesKey(speciesName));
    const types = getPBSRecordTypeKeys(record, species?.typeKeys);

    const raw = ((): RawPokemon | undefined => {
      if (species) {
        const raw: RawBuiltinPokemon = {
          v: POKEMON_VERSION,
          id: makeId(),
          species: species.key,
        };
        if (types) {
          raw.types = types;
        }
        return raw;
      } else if (types) {
        return {
          v: POKEMON_VERSION,
          id: makeId(),
          name: speciesName,
          types,
        };
      } else {
        errors.push({
          fileName: file.name,
          lineIndex: record.sectionLineIndex,
          message: "Expected a Types field.",
        });
      }
    })();
    if (!raw) continue;

    // Evolutions is always represented as
    // SECTION,Method,Param,SECTION2,Method2,Param2,...
    const evolvesToSections = record.fields.evolutions
      ?.split(/\s*,\s*/)
      .filter((_, i) => i % 3 === 0);

    const pokemon: PBSPokemon = {
      section: record.section,
      get speciesName() {
        if ("species" in raw) {
          return SPECIES.of(raw.species).name;
        } else {
          return raw.name;
        }
      },
      evolvesToSections,
      raw,
      forms: [],
    };

    out.set(record.section, pokemon);
  }

  return { errors };
}

/* -------------------------------------------------------------------------- */
/*                                 Conversions                                */
/* -------------------------------------------------------------------------- */

const OVERRIDE_NAMES_TO_KEYS: Record<string, string> = {
  "Nidoran♀": "nidoran-f",
  "Nidoran♂": "nidoran-m",
  "Flabébé": "flabebe",
};

function getSpeciesKey(speciesName: string) {
  return (
    OVERRIDE_NAMES_TO_KEYS[speciesName] ||
    speciesName
      .toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll(/[^a-z0-9-]/g, "")
  );
}
