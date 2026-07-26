import { batch, createResource, createSignal } from "solid-js";
import type { PBSLabelList, PBSParseError, PBSRecord } from "../../../../models/pokemon/pbs/parse";
import { readFileAsTextAsync, type NamedText } from "../../../../utils/file";
import { sortStrings } from "../../../../utils/string";

export interface ImportPBSState {
  files: NamedText[];
  parsed: ImportPBSParsedState | undefined;
  stepIndex: number;
  filteredDexSection: number | undefined;
  import(files: FileList): Promise<void>;
  close(): void;
  advance(): void;
  setFilteredDexSection(section: number | undefined): void;
}

export interface ImportPBSParsedState {
  errors: PBSParseError[];
  pokemonsAndForms: PBSRecord[];
  dexes: PBSLabelList[];
  pokemonsCount: number;
  formsCount: number;
}

export function createImportPBSState(): ImportPBSState {
  // Not using a store because we don't care about changes to individual values, just the list.
  const [files, setFiles] = createSignal<NamedText[]>([]);
  const [parsed] = createResource(files, async (files) => {
    const parsed: ImportPBSParsedState = {
      errors: [],
      pokemonsAndForms: [],
      dexes: [],
      pokemonsCount: 0,
      formsCount: 0,
    };

    for (const file of files) {
      const fileBasename = file.name.replace(/\.txt$/, "");
      if (fileBasename === "pokemon" || fileBasename.startsWith("pokemon_")) {
        const { parsePBSAsRecords } = await import("../../../../models/pokemon/pbs/parse");

        const record = parsePBSAsRecords(file);
        parsed.pokemonsAndForms.push(...record.out);
        parsed.errors.push(...record.errors);
        parsed.pokemonsCount += record.withoutSubsectionsCount;
        parsed.formsCount += record.withSubsectionsCount;
      } else if (fileBasename === "regional_dexes" || fileBasename.startsWith("regional_dexes_")) {
        const { parsePBSAsLabelLists: parsePBSAsIndexedLabelLists } =
          await import("../../../../models/pokemon/pbs/parse");

        const list = parsePBSAsIndexedLabelLists(file);
        parsed.dexes.push(...list.out);
        parsed.errors.push(...list.errors);
      }
    }

    return parsed;
  });

  const [stepIndex, setStepIndex] = createSignal(0);
  const [filteredDexSection, setFilteredDexSection] = createSignal<number>();

  return {
    get files() {
      return files();
    },

    get parsed() {
      return parsed();
    },

    get stepIndex() {
      return stepIndex();
    },

    get filteredDexSection() {
      return filteredDexSection();
    },

    async import(fileList) {
      const files = await Promise.all(
        [...fileList].map(async (file) => {
          const text = await readFileAsTextAsync(file);
          return { name: file.name, text };
        }),
      );
      setFiles((oldFiles) => {
        const filesByName = oldFiles.concat(files).reduce((memo: Record<string, string>, curr) => {
          return { ...memo, [curr.name]: curr.text };
        }, {});
        const allFiles = Object.entries(filesByName).map(([name, text]) => ({ name, text }));
        allFiles.sort((a, b) => sortStrings(a.name, b.name));
        return allFiles;
      });
    },

    close() {
      batch(() => {
        setFiles([]);
        setStepIndex(0);
        setFilteredDexSection(undefined);
      });
    },

    advance() {
      setStepIndex((stepIndex) => stepIndex + 1);
    },

    setFilteredDexSection,
  };
}
