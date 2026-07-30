import type { NamedText } from "../../../utils/fs/named_text";
import { parsePBSAsLabelLists } from "./parse";

export interface PBSDex {
  section: number;
  pokemonSections: string[];
}

export function parsePBSAsDexes(file: NamedText, out: Map<number, PBSDex>) {
  const { labelLists, errors } = parsePBSAsLabelLists(file);

  // NOTE: We don't verify that these pokemon sections exist.
  // I don't think that's worth the effort.
  for (const labelList of labelLists) {
    const dex: PBSDex = {
      section: labelList.section,
      pokemonSections: labelList.labels,
    };
    out.set(dex.section, dex);
  }

  return { errors };
}
