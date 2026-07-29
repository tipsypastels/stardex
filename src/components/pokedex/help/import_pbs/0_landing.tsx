import { createSignal } from "solid-js";
import { UploadButton } from "../../../common/button";
import { createImportPBSFilesState } from "./files";
import type { ImportPBSLandingPhase, ImportPBSState } from "./state";

export interface ImportPBSModalLandingProps {
  state: ImportPBSState;
  phase: ImportPBSLandingPhase;
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
    <div class="flex flex-col justify-center">
      <UploadButton
        accept="text/plain"
        multiple
        disabled={uploading()}
        // eslint-disable-next-line solid/reactivity
        onUpload={async (fileList) => {
          setUploading(true);

          const files = await createImportPBSFilesState(fileList);
          props.state.gotoDexes(files);
        }}
      >
        Upload PBS Files
      </UploadButton>
    </div>
  );
}
