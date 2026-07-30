import { ReactiveMap } from "@solid-primitives/map";
import { createResource, createRoot, createSignal, type Setter } from "solid-js";
import type { PBSFormBucket } from "../../../../models/pokemon/pbs/form/bucket";
import { createImportPBSFiles, type ImportPBSFiles } from "./files";

export type ImportPBSPhase =
  ImportPBSLandingPhase | ImportPBSDexesPhase | ImportPBSFormsPhase | ImportPBSFinishPhase;

/* --------------------------------- Landing -------------------------------- */

export interface ImportPBSLandingPhase {
  type: "landing";
  index: 0;
  dexes?: undefined;
  forms?: undefined;
}

/* ---------------------------------- Dexes --------------------------------- */

export interface ImportPBSDexesPhase {
  type: "dexes";
  index: 1;
  dexes: ImportPBSDexes;
  forms?: ImportPBSForms;
}

export interface ImportPBSDexes {
  section: number | undefined;
  setSection: Setter<number | undefined>;
}

/* ---------------------------------- Forms --------------------------------- */

export interface ImportPBSFormsPhase {
  type: "forms";
  index: 2;
  dexes: ImportPBSDexes;
  forms: ImportPBSForms;
}

export type ImportPBSFormGranularity = "all" | "types" | "known" | "custom";
export type ImportPBSFormCustomChoice = "add" | "replace" | "omit";

export interface ImportPBSForms {
  granularity: ImportPBSFormGranularity | undefined;
  customChoices: ReadonlyMap<string, ImportPBSFormCustomChoice>;
  customBuckets: PBSFormBucket[] | undefined;
  setGranularity: Setter<ImportPBSFormGranularity | undefined>;
  pushCustomChoice(bucket: PBSFormBucket, choice: ImportPBSFormCustomChoice): void;
  undoCustomChoice(): void;
  dispose(): void;
}

/* --------------------------------- Finish --------------------------------- */

export interface ImportPBSFinishPhase {
  type: "finish";
  index: 3;
  dexes: ImportPBSDexes;
  forms: ImportPBSForms;
}

/* -------------------------------------------------------------------------- */
/*                                   Factory                                  */
/* -------------------------------------------------------------------------- */

export interface ImportPBSState {
  phase: ImportPBSPhase | undefined;
  files: ImportPBSFiles;
  open(): void;
  gotoDexes(): void;
  gotoForms(): void;
  gotoFinish(): void;
  close(): void;
}

export function createImportPBSState(): ImportPBSState {
  const [phase, setPhase] = createSignal<ImportPBSPhase>();
  const files = createImportPBSFiles();

  return {
    get phase() {
      return phase();
    },
    files,
    open() {
      setPhase({ type: "landing", index: 0 });
    },
    gotoDexes() {
      setPhase((phase) => {
        const { dexes: prevDexes, ...rest } = phase ?? {};
        const dexes = prevDexes ?? createDexesState();

        return {
          ...rest,
          type: "dexes",
          index: 1,
          dexes,
        } satisfies ImportPBSDexesPhase;
      });
    },
    gotoForms() {
      setPhase((phase) => {
        if (!phase || phase.type === "landing") return phase;

        const { forms: prevForms, ...rest } = phase;
        const forms = prevForms ?? createFormsState(files);

        return {
          ...rest,
          type: "forms",
          index: 2,
          forms,
        } satisfies ImportPBSFormsPhase;
      });
    },
    gotoFinish() {
      setPhase((phase) => {
        if (phase?.type !== "forms") return phase;
        return { ...phase, type: "finish", index: 3 } satisfies ImportPBSFinishPhase;
      });
    },
    close() {
      phase()?.forms?.dispose();
      setPhase(undefined);
    },
  };
}

function createDexesState(): ImportPBSDexes {
  const [section, setSection] = createSignal<number>();

  return {
    get section() {
      return section();
    },
    setSection,
  };
}

function createFormsState(files: ImportPBSFiles): ImportPBSForms {
  return createRoot((dispose) => {
    const [granularity, setGranularity] = createSignal<ImportPBSFormGranularity>();

    const customChoices = new ReactiveMap<string, ImportPBSFormCustomChoice>();
    const customChoiceChosenBucketKeys: string[] = [];

    const [customBuckets] = createResource(
      () => (granularity() === "custom" ? files.parsed : undefined),
      async (parsed) => {
        const { getPBSFormBuckets } = await import("../../../../models/pokemon/pbs/form/bucket");
        return getPBSFormBuckets(parsed.pokemons);
      },
    );

    return {
      get granularity() {
        return granularity();
      },
      customChoices,
      get customBuckets() {
        return customBuckets();
      },
      setGranularity,
      pushCustomChoice(bucket, choice) {
        customChoices.set(bucket.key, choice);
        customChoiceChosenBucketKeys.push(bucket.key);
      },
      undoCustomChoice() {
        const key = customChoiceChosenBucketKeys.pop();
        if (key) customChoices.delete(key);
      },
      dispose,
    };
  });
}
