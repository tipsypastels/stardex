import ALISES_ from "../../../data/alt_name_aliases.json";

interface AltNameAliases {
  genericFull: [string, string | null][];
  genericPartial: [string, string][];
  specific: Record<string, [string, string | null][]>;
}

const ALIASES = ALISES_ as unknown as AltNameAliases;

export function transformAltNameWithAliases(species: string, altName: string) {
  for (const [r, name] of ALIASES.genericFull) {
    if (new RegExp(r, "i").test(altName)) {
      return name;
    }
  }
  for (const [r, name] of ALIASES.genericPartial) {
    altName = altName.replace(new RegExp(r, "i"), name);
  }
  if (species in ALIASES.specific) {
    const aliases = ALIASES.specific[species];
    for (const [r, name] of aliases) {
      if (new RegExp(r, "i").test(altName)) {
        return name;
      }
    }
  }
  return altName;
}
