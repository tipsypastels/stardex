import { batch, createMemo, createResource, createSignal } from "solid-js";
import type { PBSFormFilterBucket } from "../../../../models/pokemon/pbs/form";
import type { PBSLabelList, PBSParseError, PBSRecord } from "../../../../models/pokemon/pbs/parse";
import { readFileAsTextAsync } from "../../../../utils/file";
import { sortStrings } from "../../../../utils/string";
import type { NamedText } from "../../../../utils/types";

export interface ImportPBSState {
  files: NamedText[];
  parsed: ImportPBSParsedState | undefined;
  stepIndex: number;
  filteredDexSection: number | undefined;
  formGranularity: ImportPBSFormGranularity | undefined;
  formGranularityIsSubmittable: boolean;
  formGranularityAdvancedFilterBuckets: PBSFormFilterBucket[] | undefined;
  formGranularityAdvancedPickView: ImportPBSFormGranularityAdvancedPickView;
  import(files: FileList): Promise<void>;
  close(): void;
  advance(): void;
  setFilteredDexSection(section: number | undefined): void;
  setFormGranularity(granularity: ImportPBSFormGranularity | undefined): void;
  pushFormGranularityAdvancedDecision(decision: ImportPBSFormGranularityAdvancedDecision): void;
  undoFormGranularityAdvancedDecision(): void;
}

export interface ImportPBSParsedState {
  errors: PBSParseError[];
  pokemonsAndForms: PBSRecord[];
  dexes: PBSLabelList[];
  pokemonsCount: number;
  formsCount: number;
}

export type ImportPBSFormGranularityAdvancedDecision = "add" | "replace" | "omit";
export type ImportPBSFormGranularityAdvancedPickView =
  | { type: "loading" }
  | { type: "done" }
  | { type: "bucket"; bucket: PBSFormFilterBucket; index: number; total: number };
export type ImportPBSFormGranularity =
  | { type: "all" }
  | { type: "has-types" }
  | { type: "known" }
  // Decisions correspond to indices into formGranularityAdvancedFilterBuckets.
  | { type: "advanced"; decisions: ImportPBSFormGranularityAdvancedDecision[] };

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
        const { parsePBSAsLabelLists } = await import("../../../../models/pokemon/pbs/parse");
        const list = parsePBSAsLabelLists(file);
        parsed.dexes.push(...list.out);
        parsed.errors.push(...list.errors);
      }
    }

    return parsed;
  });

  const [stepIndex, setStepIndex] = createSignal(0);
  const [filteredDexSection, setFilteredDexSection] = createSignal<number>();

  const [formGranularity, setFormGranularity] = createSignal<ImportPBSFormGranularity>();
  const [formGranularityAdvancedFilterBuckets] = createResource(
    () => {
      const currentParsed = parsed();
      if (currentParsed && formGranularity()?.type === "advanced") return currentParsed;
    },
    async (parsed) => {
      const { getPBSFormFilterBuckets } = await import("../../../../models/pokemon/pbs/form");
      return getPBSFormFilterBuckets(parsed.pokemonsAndForms);
    },
  );

  const formGranularityIsSubmittable = createMemo(() => {
    const granularity = formGranularity();
    if (!granularity) return false;
    if (granularity.type !== "advanced") return true;

    const finishedLength = formGranularityAdvancedFilterBuckets()?.length ?? Infinity;
    return granularity.decisions.length === finishedLength;
  });

  const formGranularityAdvancedPickView = createMemo(
    (): ImportPBSFormGranularityAdvancedPickView => {
      const granularity = formGranularity();
      // This shouldn't actually happen the way the UI is set up.
      if (granularity?.type !== "advanced") return { type: "loading" };

      const index = granularity.decisions.length;
      const buckets = formGranularityAdvancedFilterBuckets();
      if (!buckets) return { type: "loading" };
      if (buckets.length === index) return { type: "done" };

      return { type: "bucket", bucket: buckets[index], index, total: buckets.length };
    },
  );

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

    get formGranularity() {
      return formGranularity();
    },

    get formGranularityIsSubmittable() {
      return formGranularityIsSubmittable();
    },

    get formGranularityAdvancedFilterBuckets() {
      return formGranularityAdvancedFilterBuckets();
    },

    get formGranularityAdvancedPickView() {
      return formGranularityAdvancedPickView();
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
        setFormGranularity(undefined);
      });
    },

    advance() {
      setStepIndex((stepIndex) => stepIndex + 1);
    },

    setFilteredDexSection,
    setFormGranularity,

    pushFormGranularityAdvancedDecision(decision) {
      setFormGranularity((granularity) => {
        if (granularity?.type === "advanced") {
          return { ...granularity, decisions: granularity.decisions.concat(decision) };
        } else {
          return { type: "advanced", decisions: [decision] };
        }
      });
    },

    undoFormGranularityAdvancedDecision() {
      setFormGranularity((granularity) => {
        if (granularity?.type !== "advanced") return granularity;
        return {
          ...granularity,
          decisions: granularity.decisions.slice(0, granularity.decisions.length - 1),
        };
      });
    },
  };
}
