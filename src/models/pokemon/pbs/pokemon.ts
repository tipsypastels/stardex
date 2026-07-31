import type { RawBuiltinPokemon, RawPokemon } from "..";
import type { NamedText } from "../../../utils/fs/named_text";
import { makeId } from "../../../utils/id";
import type { PokemonIdDump, RawPokemonWithoutClaimedId } from "../id_dump";
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

export function parsePBSAsPokemons(
  file: NamedText,
  out: Map<string, PBSPokemon>,
  idDump?: PokemonIdDump,
) {
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

    const rawWithoutId = ((): RawPokemonWithoutClaimedId | undefined => {
      if (species) {
        const raw: Omit<RawBuiltinPokemon, "id"> = {
          v: POKEMON_VERSION,
          species: species.key,
        };
        if (types) {
          raw.types = types;
        }
        return raw;
      } else if (types) {
        return {
          v: POKEMON_VERSION,
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
    if (!rawWithoutId) continue;

    const raw: RawPokemon = {
      ...rawWithoutId,
      id: idDump?.claim(rawWithoutId) ?? makeId(),
    };

    // Evolutions is always represented as
    // SECTION,Method,Param,SECTION2,Method2,Param2,...
    const evolvesToSections = record.fields.evolutions
      ?.split(/\s*,\s*/)
      .filter((_, i) => i % 3 === 0);

    const pokemon: PBSPokemon = {
      section: record.section,
      get speciesName() {
        if ("species" in rawWithoutId) {
          return SPECIES.of(rawWithoutId.species).name;
        } else {
          return rawWithoutId.name;
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
