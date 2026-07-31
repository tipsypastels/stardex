import { Show, type JSXElement } from "solid-js";
import { Modal } from "../../../common/menus/modal";
import { Steps } from "../../../common/steps";
import { ImportPBSModalLanding, ImportPBSModalLandingFooter } from "./0_landing";
import { ImportPBSModalDexes, ImportPBSModalDexesFooter } from "./1_dexes";
import { ImportPBSModalForms, ImportPBSModalFormsFooter } from "./2_forms";
import { ImportPBSModalFinish, ImportPBSModalFinishFooter } from "./3_finish";
import { ImportPBSErrors } from "./error";
import type { ImportPBSPhase, ImportPBSState } from "./state";

export interface ImportPBSModalProps {
  state: ImportPBSState;
  phase: ImportPBSPhase;
  afterImport?(): void;
}

export function ImportPBSModal(props: ImportPBSModalProps) {
  function makeChildren(inner: JSXElement, resettableErrors = true) {
    return (
      <>
        <div class="mb-2">
          <Steps
            currentIndex={props.phase.index}
            steps={[{ label: "Upload" }, { label: "Dex" }, { label: "Forms" }, { label: "Finish" }]}
          />
        </div>
        {inner}
        <Show when={props.state.files.errors.length > 0}>
          <ImportPBSErrors files={props.state.files} resettable={resettableErrors} />
        </Show>
      </>
    );
  }

  function render() {
    switch (props.phase.type) {
      case "landing": {
        return {
          children: makeChildren(<ImportPBSModalLanding />, false),
          footer: <ImportPBSModalLandingFooter state={props.state} />,
        };
      }
      case "dexes": {
        return {
          children: makeChildren(<ImportPBSModalDexes state={props.state} phase={props.phase} />),
          footer: <ImportPBSModalDexesFooter state={props.state} phase={props.phase} />,
        };
      }
      case "forms": {
        return {
          children: makeChildren(<ImportPBSModalForms state={props.state} phase={props.phase} />),
          footer: <ImportPBSModalFormsFooter state={props.state} phase={props.phase} />,
        };
      }
      case "finish": {
        return {
          children: makeChildren(<ImportPBSModalFinish state={props.state} phase={props.phase} />),
          footer: (
            <ImportPBSModalFinishFooter
              state={props.state}
              phase={props.phase}
              afterImport={props.afterImport}
            />
          ),
        };
      }
    }
  }

  return <Modal title="Import PBS Files" onClose={() => props.state.close()} {...render()} />;
}
