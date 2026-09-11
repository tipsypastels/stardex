import { createMemo, For, Show } from "solid-js";
import type { PBSError } from "../../../../models/pokemon/pbs/error";
import { ButtonLink } from "../../../common/link";
import type { ImportPBSFiles } from "./files";

export type ImportPBSError =
  { type: "model"; error: PBSError } | { type: "import"; message: string };

export interface ImportPBSErrorsProps {
  files: ImportPBSFiles;
  resettable: boolean;
}

const SHOW_MODEL_ERRORS_MAX = 3;

export function ImportPBSErrors(props: ImportPBSErrorsProps) {
  const errors = createMemo(() => {
    const allModelErrors: PBSError[] = [];
    const importErrors: string[] = [];
    for (const error of props.files.errors) {
      if (error.type === "model") {
        allModelErrors.push(error.error);
      } else {
        importErrors.push(error.message);
      }
    }
    const modelErrors = allModelErrors.slice(0, SHOW_MODEL_ERRORS_MAX);
    const additionalModelErrorsCount = allModelErrors.length - SHOW_MODEL_ERRORS_MAX;
    return { modelErrors, importErrors, additionalModelErrorsCount };
  });

  function renderModelErrorLine(error: PBSError) {
    return (
      props.files.files.find((file) => file.name === error.fileName)?.text.split("\n")[
        error.lineIndex
      ] ?? "<unknown>"
    );
  }

  return (
    <>
      <Show when={errors().importErrors.length > 0}>
        <ul class="mt-2">
          <For each={errors().importErrors}>
            {(message) => (
              <li class="rounded-md border-2 border-warning p-2 text-sm text-warning">{message}</li>
            )}
          </For>
        </ul>
      </Show>

      <Show when={errors().modelErrors.length > 0}>
        <ul class="mt-2 rounded-md border-2 border-danger p-2 text-sm">
          <For each={errors().modelErrors}>
            {(error) => (
              <li class="mb-2 last:mb-0">
                <div>
                  <span class="text-danger">{renderModelErrorLine(error)}</span>{" "}
                  <span class="text-foreground-muted">
                    ({error.fileName} line {error.lineIndex + 1})
                  </span>
                </div>
                <div class="text-foreground-muted">{error.message}</div>
              </li>
            )}
          </For>
          <Show when={errors().additionalModelErrorsCount}>
            {(count) => (
              <div>
                {count()} more parse error{count() === 1 ? "" : "s"}.
              </div>
            )}
          </Show>
        </ul>
      </Show>

      <Show when={props.resettable}>
        <div class="text-center">
          <ButtonLink onClick={() => props.files.removeFilesWithErrors()} small>
            Remove Files With Errors
          </ButtonLink>
        </div>
      </Show>
    </>
  );
}
