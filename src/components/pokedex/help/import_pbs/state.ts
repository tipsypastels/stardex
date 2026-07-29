import { createResource, createRoot, createSignal, type Setter } from "solid-js";
import { createStore } from "solid-js/store";
import type { PBSFormFilterBucket } from "../../../../models/pokemon/pbs/form";
import { type ImportPBSFiles } from "./files";

export type ImportPBSPhase =
  ImportPBSLandingPhase | ImportPBSDexesPhase | ImportPBSFormsPhase | ImportPBSFinishPhase;

/* --------------------------------- Landing -------------------------------- */

export interface ImportPBSLandingPhase {
  type: "landing";
  index: 0;
  files?: undefined;
  dexes?: undefined;
  forms?: undefined;
}

/* ---------------------------------- Dexes --------------------------------- */

export interface ImportPBSDexesPhase {
  type: "dexes";
  index: 1;
  files: ImportPBSFiles;
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
  files: ImportPBSFiles;
  dexes: ImportPBSDexes;
  forms: ImportPBSForms;
}

export type ImportPBSFormGranularity = "all" | "types" | "known" | "custom";
export type ImportPBSFormCustomChoice = "add" | "replace" | "omit";

export interface ImportPBSForms {
  granularity: ImportPBSFormGranularity | undefined;
  customChoices: ImportPBSFormCustomChoice[];
  customBuckets: PBSFormFilterBucket[] | undefined;
  setGranularity: Setter<ImportPBSFormGranularity | undefined>;
  pushCustomChoice(choice: ImportPBSFormCustomChoice): void;
  undoCustomChoice(): void;
  dispose(): void;
}

/* --------------------------------- Finish --------------------------------- */

export interface ImportPBSFinishPhase {
  type: "finish";
  index: 3;
  files: ImportPBSFiles;
  dexes: ImportPBSDexes;
  forms: ImportPBSForms;
}

/* -------------------------------------------------------------------------- */
/*                                   Factory                                  */
/* -------------------------------------------------------------------------- */

export interface ImportPBSState {
  phase: ImportPBSPhase | undefined;
  open(): void;
  gotoDexes(files: ImportPBSFiles): void;
  gotoForms(): void;
  gotoFinish(): void;
  close(): void;
}

export function createImportPBSState(): ImportPBSState {
  const [phase, setPhase] = createSignal<ImportPBSPhase>();

  return {
    get phase() {
      return phase();
    },

    open() {
      setPhase({ type: "landing", index: 0 });
    },

    gotoDexes(files) {
      setPhase((phase) => {
        const { dexes: prevDexes, ...rest } = phase ?? {};
        const dexes = prevDexes ?? createDexesState();

        return {
          ...rest,
          type: "dexes",
          index: 1,
          dexes,
          files,
        } satisfies ImportPBSDexesPhase;
      });
    },

    gotoForms() {
      setPhase((phase) => {
        if (!phase || phase.type === "landing") return phase;

        const { forms: prevForms, ...rest } = phase;
        const forms = prevForms ?? createFormsState(phase.files);

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
    const [customChoices, setCustomChoices] = createStore<ImportPBSFormCustomChoice[]>([]);
    const [customBuckets] = createResource(
      () => (granularity() === "custom" ? files.parsed : undefined),
      async (parsed) => {
        const { getPBSFormFilterBuckets } = await import("../../../../models/pokemon/pbs/form");
        return getPBSFormFilterBuckets([...parsed.pokemons, ...parsed.forms]);
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
      pushCustomChoice(choice) {
        setCustomChoices(customChoices.length, choice);
      },
      undoCustomChoice() {
        setCustomChoices((choices) => choices.slice(0, choices.length - 1));
      },
      dispose,
    };
  });
}
