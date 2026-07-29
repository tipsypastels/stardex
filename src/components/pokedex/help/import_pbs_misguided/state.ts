import { createMemo, createResource, createSignal, type Setter } from "solid-js";
import { createStore } from "solid-js/store";
import type { PBSFormFilterBucket } from "../../../../models/pokemon/pbs/form";
import { createImportPBSFilesState, type ImportPBSFilesState } from "../import_pbs/files";

export type ImportPBSPhase = ImportPBSLandingPhase | ImportPBSDexesPhase | ImportPBSFormsPhase;

export interface ImportPBSLandingPhase {
  type: "landing";
  index: 0;
}

export interface ImportPBSDexesPhase {
  type: "dexes";
  index: 1;
  files: ImportPBSFilesState;
  dexSection: number | undefined;
  setDexSection: Setter<number | undefined>;
}

export interface ImportPBSFormsPhase {
  type: "forms";
  index: 2;
  files: ImportPBSFilesState;
  dexSection: number | undefined;
  formGranularity: ImportPBSFormsPhaseGranularity | undefined;
  formCustomChoices: ImportPBSFormsPhaseCustomChoice[];
  formCustomBuckets: PBSFormFilterBucket[] | undefined;
  formCustomView:
    { type: "bucket"; bucket: PBSFormFilterBucket; index: number; total: number } | undefined;
  submittable: boolean;
  setFormGranularity: Setter<ImportPBSFormsPhaseGranularity | undefined>;
  pushFormCustomChoice(choice: ImportPBSFormsPhaseCustomChoice): void;
  undoFormCustomChoice(): void;
}

export type ImportPBSFormsPhaseGranularity = "all" | "types" | "known" | "custom";
export type ImportPBSFormsPhaseCustomChoice = "add" | "replace" | "omit";

export interface ImportPBSState {
  phase: ImportPBSPhase | undefined;
  openLanding(): void;
  gotoDexes(fileList: FileList): Promise<void>;
  gotoForms(): void;
  close(): void;
}

export function createImportPBSState(): ImportPBSState {
  const [phase, setPhase] = createSignal<ImportPBSPhase>();

  return {
    get phase() {
      return phase();
    },

    openLanding() {
      setPhase({ type: "landing", index: 0 });
    },

    async gotoDexes(fileList) {
      const files = await createImportPBSFilesState(fileList);
      setPhase(createDexesPhase(files));
    },

    gotoForms() {
      setPhase((phase) => {
        if (phase?.type !== "dexes") return phase;
        return createFormsPhase(phase);
      });
    },

    close() {
      setPhase(undefined);
    },
  };
}

function createDexesPhase(files: ImportPBSFilesState): ImportPBSDexesPhase {
  const [dexSection, setDexSection] = createSignal<number>();

  return {
    type: "dexes",
    index: 1,
    files,
    get dexSection() {
      return dexSection();
    },
    setDexSection,
  };
}

export function createFormsPhase(dexes: ImportPBSDexesPhase): ImportPBSFormsPhase {
  const [formGranularity, setFormGranularity] = createSignal<ImportPBSFormsPhaseGranularity>();
  const [formCustomChoices, setFormCustomChoices] = createStore<ImportPBSFormsPhaseCustomChoice[]>(
    [],
  );

  const [formCustomBuckets] = createResource(
    () => (formGranularity() === "custom" ? dexes.files.parsed : undefined),
    async (parsed) => {
      const { getPBSFormFilterBuckets } = await import("../../../../models/pokemon/pbs/form");
      return getPBSFormFilterBuckets([...parsed.pokemons, ...parsed.forms]);
    },
  );

  const formCustomView = createMemo(() => {});

  return {
    type: "forms",
    index: 2,
    files: dexes.files,
    dexSection: dexes.dexSection,
    get formGranularity() {
      return formGranularity();
    },
    formCustomChoices,
    get formCustomBuckets() {
      return formCustomBuckets();
    },
    setFormGranularity,
    pushFormCustomChoice(choice) {
      setFormCustomChoices(formCustomChoices.length, choice);
    },
    undoFormCustomChoice() {
      setFormCustomChoices((choices) => choices.slice(0, choices.length - 1));
    },
  };
}
