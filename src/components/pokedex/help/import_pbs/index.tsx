import type { JSXElement } from "solid-js";
import { Modal } from "../../../common/menus/modal";
import { Steps } from "../../../common/steps";
import { ImportPBSModalLanding, ImportPBSModalLandingFooter } from "./0_landing";
import { ImportPBSModalDexes, ImportPBSModalDexesFooter } from "./1_dexes";
import { ImportPBSModalForms, ImportPBSModalFormsFooter } from "./2_forms";
import { ImportPBSModalFinish, ImportPBSModalFinishFooter } from "./3_finish";
import type { ImportPBSPhase, ImportPBSState } from "./state";

export interface ImportPBSModalProps {
  state: ImportPBSState;
  phase: ImportPBSPhase;
}

export function ImportPBSModal(props: ImportPBSModalProps) {
  function makeChildren(inner: JSXElement) {
    return (
      <>
        <div class="mb-2">
          <Steps
            currentIndex={props.phase.index}
            steps={[{ label: "Upload" }, { label: "Dex" }, { label: "Forms" }, { label: "Finish" }]}
          />
        </div>
        {inner}
      </>
    );
  }

  function render() {
    // TODO: Handle errors and empty dexes.
    switch (props.phase.type) {
      case "landing": {
        return {
          children: makeChildren(<ImportPBSModalLanding />),
          footer: <ImportPBSModalLandingFooter state={props.state} phase={props.phase} />,
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
          footer: <ImportPBSModalFinishFooter state={props.state} phase={props.phase} />,
        };
      }
    }
  }

  return <Modal title="Import PBS Files" onClose={() => props.state.close()} {...render()} />;
}
