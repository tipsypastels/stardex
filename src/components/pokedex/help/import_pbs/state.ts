import { createResource, createSignal, type Setter } from "solid-js";
import { createStore } from "solid-js/store";
import type { PBSFormFilterBucket } from "../../../../models/pokemon/pbs/form";
import { type ImportPBSFilesState } from "./files";

export type ImportPBSPhase = ImportPBSLandingPhase | ImportPBSDexesPhase | ImportPBSFormsPhase;

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
  files: ImportPBSFilesState;
  dexes: ImportPBSDexesState;
  forms?: ImportPBSFormsState;
}

export interface ImportPBSDexesState {
  section: number | undefined;
  setSection: Setter<number | undefined>;
}

/* ---------------------------------- Forms --------------------------------- */

export interface ImportPBSFormsPhase {
  type: "forms";
  index: 2;
  files: ImportPBSFilesState;
  dexes: ImportPBSDexesState;
  forms: ImportPBSFormsState;
}

export type ImportPBSFormGranularity = "all" | "types" | "known" | "custom";
export type ImportPBSFormCustomChoice = "add" | "replace" | "omit";

export interface ImportPBSFormsState {
  granularity: ImportPBSFormGranularity | undefined;
  customChoices: ImportPBSFormCustomChoice[];
  customBuckets: PBSFormFilterBucket[] | undefined;
  setGranularity: Setter<ImportPBSFormGranularity | undefined>;
  pushCustomChoice(choice: ImportPBSFormCustomChoice): void;
  undoCustomChoice(): void;
}

/* -------------------------------------------------------------------------- */
/*                                   Factory                                  */
/* -------------------------------------------------------------------------- */

export interface ImportPBSState {
  phase: ImportPBSPhase | undefined;
  open(): void;
  gotoDexes(files: ImportPBSFilesState): Promise<void>;
  gotoForms(): void;
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

    async gotoDexes(files) {
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

    close() {
      setPhase(undefined);
    },
  };
}

function createDexesState(): ImportPBSDexesState {
  const [section, setSection] = createSignal<number>();

  return {
    get section() {
      return section();
    },
    setSection,
  };
}

function createFormsState(files: ImportPBSFilesState): ImportPBSFormsState {
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
  };
}
