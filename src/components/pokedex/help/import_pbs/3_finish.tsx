import { createSignal, Match, Switch } from "solid-js";
import { Button } from "../../../common/button";
import { ButtonLink, UploadLink } from "../../../common/link";
import { importPBS } from "./import";
import type { ImportPBSFinishPhase, ImportPBSState } from "./state";

export interface ImportPBSModalFinishProps {
  state: ImportPBSState;
  phase: ImportPBSFinishPhase;
  afterImport?(): void;
}

export function ImportPBSModalFinish(props: ImportPBSModalFinishProps) {
  return (
    <>
      <p class="mb-2">
        Ready to import <strong>{props.state.files.files.length}</strong> file
        {props.state.files.files.length === 1 ? "" : "s"}, with these settings:
      </p>

      <ul class="mb-2 list-inside list-disc">
        <li>
          <strong>Dex:</strong>{" "}
          {props.phase.dexes.section != null
            ? `Pokédex ${props.phase.dexes.section}`
            : "Not filtering"}
          .
        </li>
        <li>
          <strong>Forms:</strong>{" "}
          <Switch fallback="Including only bases.">
            <Match when={props.phase.forms.granularity === "all"}>All.</Match>
            <Match when={props.phase.forms.granularity === "types"}>Any with type changes.</Match>
            <Match when={props.phase.forms.granularity === "known"}>
              Any recognized by Stardex.
            </Match>
            <Match when={props.phase.forms.granularity === "custom"}>
              Decided for each form class.
            </Match>
          </Switch>
        </li>
      </ul>

      <p class="mb-2">Are you ready to go? You can still...</p>

      <ul class="list-inside list-disc">
        <li>
          <UploadLink
            accept="text/plain"
            multiple
            onUpload={(fileList) => props.state.files.import(fileList)}
          >
            Upload more files.
          </UploadLink>
        </li>
        <li>
          <ButtonLink onClick={() => props.state.gotoDexes()}>
            Go back to dex settings.
          </ButtonLink>{" "}
        </li>
        <li>
          <ButtonLink onClick={() => props.state.gotoForms()}>Go back to form settings.</ButtonLink>
        </li>
      </ul>
    </>
  );
}

export function ImportPBSModalFinishFooter(props: ImportPBSModalFinishProps) {
  const [finishing, setFinishing] = createSignal(false);
  return (
    <div class="flex flex-col justify-center">
      <Button
        // eslint-disable-next-line solid/reactivity
        onClick={async () => {
          setFinishing(true);
          await importPBS(props.state, props.phase);
          props.afterImport?.();
        }}
        disabled={finishing() || props.state.files.errors.length > 0}
      >
        Import
      </Button>
    </div>
  );
}
