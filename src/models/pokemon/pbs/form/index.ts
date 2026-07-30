import type { RawBuiltinPokemon, RawPokemon } from "../..";
import type { NamedText } from "../../../../utils/fs/named_text";
import { id } from "../../../../utils/id";
import { SPECIES, type Species } from "../../species";
import { POKEMON_VERSION } from "../../versioned";
import { parsePBSAsRecords } from "../parse";
import type { PBSPokemon } from "../pokemon";
import { getPBSRecordTypeKeys } from "../type";

export interface PBSForm {
  section: string;
  subsection: number;
  formName: string;
  speciesName: string;
  raw: RawPokemon;
}

export function parsePBSAsForms(file: NamedText, pokemons: Map<string, PBSPokemon>) {
  const { records, errors } = parsePBSAsRecords(file);
  let count = 0;

  for (const record of records) {
    if (record.subsection == null) {
      errors.push({
        fileName: file.name,
        lineIndex: record.sectionLineIndex,
        message: "Expected a form number.",
      });
      continue;
    }

    const pokemon = pokemons.get(record.section);
    if (!pokemon) {
      errors.push({
        fileName: file.name,
        lineIndex: record.sectionLineIndex,
        message: "Unknown Pokémon.",
      });
      continue;
    }

    const formNameMaybeWithSpeciesName = record.fields.formname;
    if (!formNameMaybeWithSpeciesName) {
      continue; // Not an error, just ignore.
    }

    const formName = getFormName(formNameMaybeWithSpeciesName, record.section, pokemon.speciesName);

    const raw = ((): RawPokemon => {
      if ("species" in pokemon.raw) {
        const species = SPECIES.of(pokemon.raw.species);
        const types = getPBSRecordTypeKeys(record, pokemon.raw.types);
        const alt = getAlt(formName, species);
        const raw: RawBuiltinPokemon = {
          v: POKEMON_VERSION,
          id: id(),
          species: species.key,
        };
        if (types) {
          raw.types = types;
        }
        if (alt) {
          raw.alt = alt.kind;
        } else {
          raw.customAltName = formName;
        }
        return raw;
      } else {
        const types = getPBSRecordTypeKeys(record) ?? pokemon.raw.types;
        return {
          v: POKEMON_VERSION,
          id: id(),
          name: pokemon.speciesName,
          types,
          altName: formName,
        };
      }
    })();

    pokemon.forms[record.subsection] = {
      section: record.section,
      subsection: record.subsection,
      formName,
      get speciesName() {
        if ("species" in raw) {
          return SPECIES.of(raw.species).name;
        } else {
          return raw.name;
        }
      },
      raw,
    };
    count++;
  }

  return { errors, count };
}

/* -------------------------------------------------------------------------- */
/*                                 Conversions                                */
/* -------------------------------------------------------------------------- */

const OVERRIDE_SECTION_FORM_NAMES: Record<string, string> = {
  "DARMANITAN:Zen Mode": "Zen",
  "DARMANITAN:Galarian Standard Mode": "Galarian",
  "DARMANITAN:Galarian Zen Mode": "Galarian Zen",
  "MAGEARNA:Original Color": "Original",
  "MAGEARNA:Mega (Original Color)": "Original Mega",
  "TATSUGIRI:Mega Tatsugiri (Curly Form)": "Curly Mega",
  "TATSUGIRI:Mega Tatsugiri (Stretchy Form)": "Stretchy Mega",
  "TATSUGIRI:Mega Tatsugiri (Droopy Form)": "Droopy Mega",
  "TAUROS:Paldean (Combat Breed)": "Paldean Combat Breed",
  "TAUROS:Paldean (Blaze Breed)": "Paldean Blaze Breed",
  "TAUROS:Paldean (Aqua Breed)": "Paldean Aqua Breed",
};

export function getFormName(
  formNameMaybeWithSpeciesName: string,
  section: string,
  speciesName: string,
) {
  const overridden = OVERRIDE_SECTION_FORM_NAMES[`${section}:${formNameMaybeWithSpeciesName}`];
  if (overridden) return overridden;

  return formNameMaybeWithSpeciesName
    .replace(speciesName, "")
    .replace(/\s*\bForme?\b\s*/, "")
    .replace(/\s*\bStyle\b\s*/, "")
    .replace(/-$/, "")
    .replace(/  +/g, " ")
    .trim();
}

export function getAlt(formName: string, species: Species) {
  const formNameAsKind = formName
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll(/[^a-z0-9-]/g, "");

  return species?.alts.find((alt) => alt.name === formName || alt.kind === formNameAsKind);
}
