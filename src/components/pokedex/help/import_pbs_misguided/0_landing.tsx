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
        As in Essentials, suffixes like <code>pokemon_myregion.txt</code> are allowed. Any other
        files will be ignored.
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
        onUpload={(fileList) => {
          setUploading(true);
          props.state.gotoDexes(fileList);
        }}
      >
        Upload PBS Files
      </UploadButton>
    </div>
  );
}
