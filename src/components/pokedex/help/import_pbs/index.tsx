import { Match, Show, Switch } from "solid-js";
import { Modal } from "../../../common/menus/modal";
import { Steps } from "../../../common/steps";
import type { ImportPBSParsedState, ImportPBSState } from "./state";
import { ImportPBSStep0Dex } from "./step0_dex";
import { ImportPBSStep1Forms } from "./step1_forms";

export interface ImportPBSModalProps {
  state: ImportPBSState;
}

export function ImportPBSModal(props: ImportPBSModalProps) {
  return (
    <Modal title="Import PBS Files" onClose={() => props.state.close()}>
      <Show when={props.state.parsed} fallback="Parsed loading TODO">
        {(parsed) => (
          <Switch fallback={<Inner state={props.state} parsed={parsed()} />}>
            <Match when={parsed().pokemonsAndForms.length === 0}>TODO no pokemon</Match>
            <Match when={parsed().errors.length > 0}>TODO errors</Match>
          </Switch>
        )}
      </Show>
    </Modal>
  );
}

export interface ImportPBSStepProps extends ImportPBSModalProps {
  parsed: ImportPBSParsedState;
}

function Inner(props: ImportPBSStepProps) {
  return (
    <>
      <div class="mb-2">
        <Steps
          currentIndex={props.state.stepIndex}
          steps={[{ label: "Dex" }, { label: "Forms" }, { label: "Finish" }]}
        />
      </div>
      <Switch>
        <Match when={props.state.stepIndex === 0}>
          <ImportPBSStep0Dex {...props} />
        </Match>
        <Match when={props.state.stepIndex === 1}>
          <ImportPBSStep1Forms {...props} />
        </Match>
      </Switch>
    </>
  );
}
