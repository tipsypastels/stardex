import type { NamedText } from "../../../../utils/fs/named_text";
import { parsePBSAsRecords } from "../parse";
import type { PBSPokemon } from "../pokemon";

export interface PBSForm {
  section: string;
  subsection: number;
}

export function parsePBSAsForms(
  file: NamedText,
  getPokemon: (section: string) => PBSPokemon | undefined,
) {
  const { records, errors } = parsePBSAsRecords(file);

  for (const record of records) {
    if (record.subsection == null) {
      errors.push({
        fileName: file.name,
        lineIndex: record.sectionLineIndex,
        message: "Expected a form number.",
      });
      continue;
    }

    const pokemon = getPokemon(record.section);
    if (!pokemon) {
      errors.push({
        fileName: file.name,
        lineIndex: record.sectionLineIndex,
        message: "Unknown Pokémon.",
      });
      continue;
    }
  }

  return { errors };
}
