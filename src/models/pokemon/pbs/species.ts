import { SPECIES } from "../species";

const TROUBLESOME_IDS: Record<string, string> = {
  NIDORANfE: "nidoran-f",
  NIDORANmA: "nidoran-m",
  FLABEBE: "flabebe",
};

// We can't convert the sections to keys because they're MRMIME format.
// We could hardcode exceptions but sectionName is also available at all call sites.
export function getPBSRecordSectionSpeciesKey(section: string, speciesName: string) {
  return (
    TROUBLESOME_IDS[section] ||
    speciesName
      .toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll(/[^a-z0-9-]/g, "")
  );
}

export function getPBSRecordSectionSpecies(section: string, speciesName: string) {
  return SPECIES.tryOf(getPBSRecordSectionSpeciesKey(section, speciesName));
}
