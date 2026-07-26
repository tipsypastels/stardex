import type { NamedText } from "../../../utils/file";

// Used for pokemon.txt and pokemon_forms.txt.
export interface PBSRecord {
  section: string;
  subsection?: number;
  fields: Record<string, string>;
}

// Used for regional_dexes.txt.
export interface PBSLabelList {
  section: number;
  labels: string[];
}

export interface PBSParseError {
  fileName: string;
  lineIndex: number;
  message: string;
}

export function parsePBSAsRecords(file: NamedText) {
  const out: PBSRecord[] = [];
  const errors: PBSParseError[] = [];

  let current: PBSRecord | undefined;
  let withSubsectionsCount = 0;
  let withoutSubsectionsCount = 0;

  const lines = file.text.split("\n");

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim().replace(/\s*#.*$/, "");
    if (line.length === 0) {
      continue;
    }

    let heading: RegExpMatchArray | null;
    let kv: RegExpMatchArray | null;

    if ((heading = line.match(/^\[\s*([A-z0-9]+)\s*(?:,\s*(\d+)\s*)?\]$/))) {
      const section = heading[1];
      const subsection = heading[1];

      if (current) {
        out.push(current);
      }
      if (subsection) {
        withSubsectionsCount++;
      } else {
        withoutSubsectionsCount++;
      }
      current = {
        section,
        subsection: subsection ? +subsection : undefined,
        fields: {},
      };
    } else if ((kv = line.match(/^\s*(\w+)\s*=\s*(.*)$/))) {
      const key = kv[1].toLowerCase();
      const value = kv[2];

      if (!current) {
        errors.push({
          fileName: file.name,
          lineIndex,
          message: "Expected a section at the start of the file.",
        });
        continue;
      }
      current.fields[key] = value;
    } else {
      errors.push({
        fileName: file.name,
        lineIndex,
        message: "Unexpected syntax, expected [SECTION] or Property=Value.",
      });
    }
  }
  if (current) {
    out.push(current);
  }

  return { out, errors, withSubsectionsCount, withoutSubsectionsCount };
}

export function parsePBSAsLabelLists(file: NamedText) {
  const out: PBSLabelList[] = [];
  const errors: PBSParseError[] = [];

  let current: PBSLabelList | undefined;

  const lines = file.text.split("\n");

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim().replace(/\s*#.*$/, "");
    if (line.length === 0) {
      continue;
    }

    let heading: RegExpMatchArray | null;
    let labels: RegExpMatchArray | null;

    if ((heading = line.match(/^\[\s*(\d+)\]$/))) {
      const section = +heading[1];

      if (current) {
        out.push(current);
      }
      current = {
        section,
        labels: [],
      };
    } else if ((labels = line.match(/^\s*([A-z0-9]+(?:\s*,\s*[A-z0-9]+)*)(?:\s*,\s*)?\s*$/))) {
      if (!current) {
        errors.push({
          fileName: file.name,
          lineIndex,
          message: "Expected a section at the start of the file.",
        });
        continue;
      }
      current.labels.push(...labels[1].split(/\s*,\s*/));
    } else {
      errors.push({
        fileName: file.name,
        lineIndex,
        message: "Unexpected syntax, expected [INDEX] or SPECIES1, SPECIES2, SPECIES3...",
      });
    }
  }
  if (current) {
    out.push(current);
  }

  return { out, errors };
}
