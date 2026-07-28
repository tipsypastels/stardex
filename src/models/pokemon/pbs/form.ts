import { mapOfArraysAppend } from "../../../utils/collection";
import { sortStrings } from "../../../utils/string";
import { SPECIES } from "../species";
import type { PBSRecord } from "./parse";
import { getPBSRecordSectionSpecies } from "./species";

export interface PBSFormFilterBucket {
  groupedBy: "formName" | "line";
  entries: PBSFormFilterBucketEntry[];
  // If groupedBy formName, this is the form name.
  // If groupedBy line this is the root species name.
  displayName: string;
}

export interface PBSFormFilterBucketEntry {
  section: string;
  subsection: number;
  formName: string;
  resolutionInfo: PBSFormFilterBucketEntryResolutionInfo;
}

export type PBSFormFilterBucketEntryResolutionInfo =
  | { kind: "known"; speciesKey: string; altKind: string }
  | { kind: "known-custom-type-icon"; speciesKey: string; typeKeys: string[] }
  | { kind: "custom"; speciesKey: string }
  | { kind: "unknown"; speciesName: string };

export function getPBSFormFilterBuckets(records: PBSRecord[]): PBSFormFilterBucket[] {
  const lines = new Lines();

  // We can't do a species lookup because we want to remove the names of custom pokemon from their form names too.
  const sectionsToSpeciesNames = new Map<string, string>();

  for (const record of records) {
    if (!record.subsection && record.fields.name) {
      sectionsToSpeciesNames.set(record.section, record.fields.name);
      lines.find(record.section);
    }

    if (record.fields.evolutions) {
      // Evolutions is always represented as
      // SECTION,Method,Param,SECTION2,Method2,Param2,...
      const values = record.fields.evolutions.split(/\s*,\s*/);
      for (let i = 0; i < values.length; i += 3) {
        const toSection = values[i];
        lines.relate(record.section, toSection);
      }
    }
  }

  const formNameToEntries = new Map<string, PBSFormFilterBucketEntry[]>();

  for (const record of records) {
    if (!record.subsection) {
      continue;
    }

    const { formname: formNameMaybeWithSpeciesName } = record.fields;
    if (!formNameMaybeWithSpeciesName) {
      continue;
    }

    const speciesName = sectionsToSpeciesNames.get(record.section);
    if (!speciesName) {
      continue;
    }

    // TODO: Normalize special cases.
    let formName = formNameMaybeWithSpeciesName
      .replace(speciesName, "")
      .replace(/\s*\bForme?\b\s*/, "")
      .replace(/\s*\bStyle\b\s*/, "")
      .replace(/\s*\bGiga\b\s*/, "Gigantamax")
      .replace(/-$/, "")
      .replace(/  +/g, " ")
      .trim();

    const overrideKey = `${record.section}:${formName}`;
    if (OVERRIDE_SECTION_FORM_NAMES[overrideKey]) {
      formName = OVERRIDE_SECTION_FORM_NAMES[overrideKey];
    }

    const resolutionInfo = ((): PBSFormFilterBucketEntryResolutionInfo => {
      const species = getPBSRecordSectionSpecies(record.section, speciesName);
      const formNameAsKind = formName
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll(/[^a-z0-9-]/g, "");

      const altKind = species?.alts.find(
        (alt) => alt.name === formName || alt.kind === formNameAsKind,
      )?.kind;

      if (altKind && species) {
        return { kind: "known", speciesKey: species.key, altKind };
      }

      if (species?.hasCustomTypeIcons && record.fields.types) {
        const typeKeys = record.fields.types.toLowerCase().split(/\s*,\s*/);
        if (species.getCustomTypeIconIndex(typeKeys)) {
          return { kind: "known-custom-type-icon", speciesKey: species.key, typeKeys };
        }
      }

      if (species) {
        return { kind: "custom", speciesKey: species.key };
      }

      return { kind: "unknown", speciesName };
    })();

    mapOfArraysAppend(formNameToEntries, formName, {
      section: record.section,
      subsection: record.subsection,
      formName,
      resolutionInfo,
    });
  }

  const nameBuckets: PBSFormFilterBucket[] = [];
  const rootSectionToEntries = new Map<string, PBSFormFilterBucketEntry[]>();

  for (const [formName, entries] of formNameToEntries) {
    const linesInvolved = new Set(entries.map((entry) => lines.find(entry.section)));

    if (linesInvolved.size > 1) {
      nameBuckets.push({
        groupedBy: "formName",
        displayName: formName,
        entries,
      });
    } else {
      const [rootSection] = linesInvolved;
      mapOfArraysAppend(rootSectionToEntries, rootSection, ...entries);
    }
  }

  const lineBuckets = [...rootSectionToEntries.values()].map((entries): PBSFormFilterBucket => {
    const [firstEntry] = entries;
    const displayName =
      firstEntry.resolutionInfo.kind === "unknown"
        ? firstEntry.resolutionInfo.speciesName
        : SPECIES.of(firstEntry.resolutionInfo.speciesKey).name;

    return {
      groupedBy: "line",
      entries,
      displayName,
    };
  });

  const buckets = [...nameBuckets, ...lineBuckets];

  buckets.sort((left, right) => sortStrings(left.displayName, right.displayName));

  return buckets;
}

class Lines {
  #roots = new Map<string, string>();

  find(section: string) {
    this.#setAsSelfParentIfNone(section);

    let root = section;

    while (this.#roots.get(root) !== root) {
      root = this.#roots.get(root)!;
    }

    let current = section;

    while (this.#roots.get(current) != root) {
      const next = this.#roots.get(current)!;
      this.#roots.set(current, root);
      current = next;
    }

    return root;
  }

  relate(fromSection: string, toSection: string) {
    const fromRoot = this.find(fromSection);
    const toRoot = this.find(toSection);
    if (fromRoot !== toRoot) {
      this.#roots.set(toRoot, fromRoot);
    }
  }

  #setAsSelfParentIfNone(section: string) {
    if (!this.#roots.has(section)) {
      this.#roots.set(section, section);
    }
  }
}

const OVERRIDE_SECTION_FORM_NAMES: Record<string, string> = {
  "DARMANITAN:Zen Mode": "Zen",
  "DARMANITAN:Galarian Standard Mode": "Galarian",
  "DARMANITAN:Galarian Zen Mode": "Galarian Zen",
  "MAGEARNA:Original Color": "Original",
  "MAGEARNA:Mega (Original Color)": "Original Mega",
  "TATSUGIRI:Mega (Curly)": "Curly Mega",
  "TATSUGIRI:Mega (Stretchy)": "Stretchy Mega",
  "TATSUGIRI:Mega (Droopy)": "Droopy Mega",
  "TAUROS:Paldean (Combat Breed)": "Paldean Combat Breed",
  "TAUROS:Paldean (Blaze Breed)": "Paldean Blaze Breed",
  "TAUROS:Paldean (Aqua Breed)": "Paldean Aqua Breed",
};
