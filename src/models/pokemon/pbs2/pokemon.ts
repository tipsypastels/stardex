import type { RawBuiltinPokemon, RawPokemon } from "..";
import type { NamedText } from "../../../utils/fs/named_text";
import { id } from "../../../utils/id";
import { SPECIES } from "../species";
import { POKEMON_VERSION } from "../versioned";
import type { PBSForm } from "./form";
import { parsePBSAsRecords } from "./parse";
import { getPBSRecordTypeKeys } from "./type";

export interface PBSPokemon {
  section: string;
  raw: RawPokemon;
  forms: PBSForm[];
}

export function parsePBSAsPokemons(file: NamedText) {
  const { records, errors } = parsePBSAsRecords(file);
  const pokemons: PBSPokemon[] = [];

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
        const pokemon: RawBuiltinPokemon = {
          v: POKEMON_VERSION,
          id: id(),
          species: species.key,
        };
        if (types) {
          pokemon.types = types;
        }
        return pokemon;
      } else if (types) {
        return {
          v: POKEMON_VERSION,
          id: id(),
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

    pokemons.push({ section: record.section, raw, forms: [] });
  }

  return { pokemons, errors };
}

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
