import type { RawBuiltinPokemon, RawPokemon } from "../..";
import type { NamedText } from "../../../../utils/fs/named_text";
import { makeId } from "../../../../utils/id";
import type { PokemonIdDump, RawPokemonWithoutClaimedId } from "../../id_dump";
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

export function parsePBSAsForms(
  file: NamedText,
  pokemons: Map<string, PBSPokemon>,
  idDump?: PokemonIdDump,
) {
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

    const rawWithoutId = ((): RawPokemonWithoutClaimedId => {
      if ("species" in pokemon.raw) {
        const species = SPECIES.of(pokemon.raw.species);
        const alt = getAlt(formName, species);
        const types = getPBSRecordTypeKeys(record, alt?.typeKeys ?? pokemon.raw.types);
        const raw: Omit<RawBuiltinPokemon, "id"> = {
          v: POKEMON_VERSION,
          species: species.key,
        };
        if (alt) {
          raw.alt = alt.kind;
        } else if (species.hasCustomTypeIcons && types && species.getCustomTypeIconIndex(types)) {
          // Do nothing, having the type will set the icon. Do not set an alt.
        } else {
          raw.customAltName = formName;
        }
        if (types) {
          raw.types = types;
        }
        return raw;
      } else {
        const types = getPBSRecordTypeKeys(record) ?? pokemon.raw.types;
        return {
          v: POKEMON_VERSION,
          name: pokemon.speciesName,
          types,
          altName: formName,
        };
      }
    })();

    const raw: RawPokemon = {
      ...rawWithoutId,
      id: idDump?.claim(rawWithoutId) ?? makeId(),
    };

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
  "MAGEARNA:Mega Magearna (Original Color)": "Original Mega",
  "TATSUGIRI:Mega Tatsugiri (Curly Form)": "Curly Mega",
  "TATSUGIRI:Mega Tatsugiri (Stretchy Form)": "Stretchy Mega",
  "TATSUGIRI:Mega Tatsugiri (Droopy Form)": "Droopy Mega",
  "TAUROS:Paldean (Combat Breed)": "Paldean Combat Breed",
  "TAUROS:Paldean (Blaze Breed)": "Paldean Blaze Breed",
  "TAUROS:Paldean (Aqua Breed)": "Paldean Aqua Breed",
  "FLOETTE:Eternal Flower": "Eternal",
  "MORPEKO:Hangry Mode": "Hangry",
  "URSHIFU:Gigantamax Single Strike Style": "Single Strike Gigantamax",
  "URSHIFU:Gigantamax Rapid Strike Style": "Rapid Strike Gigantamax",
  "MINIOR:Red Core": "Core",
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
