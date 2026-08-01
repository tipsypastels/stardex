import { createSignal } from "solid-js";
import { UploadButton } from "../../../common/button";
import type { ImportPBSState } from "./state";

export interface ImportPBSModalLandingProps {
  state: ImportPBSState;
}

export function ImportPBSModalLanding() {
  return (
    <>
      <p class="mb-2">Stardex can read these PBS files:</p>
      <ul class="mb-2 list-inside list-disc">
        <li>
          <code>pokemon.txt</code>.
        </li>
        <li>
          <code>pokemon_forms.txt</code> <span class="text-foreground-muted">(optional)</span>.
        </li>
        <li>
          <code>regional_dexes.txt</code> <span class="text-foreground-muted">(optional)</span>.
        </li>
      </ul>
      <p class="mb-2">
        As in Essentials, splitting up files with suffixes like <code>pokemon_myregion.txt</code> is
        allowed. Any other files will be ignored.
      </p>
      <p>You'll be given the chance to filter your imports in later steps.</p>
    </>
  );
}

export function ImportPBSModalLandingFooter(props: ImportPBSModalLandingProps) {
  const [uploading, setUploading] = createSignal(false);
  return (
    <>
      <div class="mb-2 flex flex-col justify-center">
        <UploadButton
          accept="text/plain"
          multiple
          disabled={uploading()}
          // eslint-disable-next-line solid/reactivity
          onUpload={async (fileList) => {
            setUploading(true);
            await props.state.files.importOverwrite(fileList);
            if (props.state.files.errors.length === 0) {
              props.state.gotoDexes();
            } else {
              setUploading(false);
            }
          }}
        >
          Upload PBS Files
        </UploadButton>
      </div>

      <div class="text-center text-sm">
        <strong>Tip:</strong> You can upload multiple files at once
        <span class="max-md:hidden">
          {" "}
          using {navigator.platform.startsWith("Mac") ? "Cmd" : "Ctrl"}- or Shift-clicks
        </span>
        .
      </div>
    </>
  );
}
