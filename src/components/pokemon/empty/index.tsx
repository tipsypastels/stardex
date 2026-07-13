import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useSaver } from "../../../state/save";
import { ButtonLink, UploadLink } from "../../common/link";
import { ImportPBSErrorModal, usePBSImport } from "./import_pbs";
import { ImportRegionModal } from "./import_region";

export function EmptyPokedex() {
  const importRegionModalOpen = useSignal(false);
  const saver = useSaver();
  const pbsImport = usePBSImport();

  function loadSaveJSONOrText([file]: FileList) {
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = () => {
      const text = fileReader.result as string;
      if (file.type === "application/json") {
        saver.load(JSON.parse(text));
      } else {
        // TODO
        alert("Not yet implemented.");
      }
    };

    fileReader.readAsText(file);
  }

  return (
    <>
      <div class="rounded-t-md border-2 border-primary p-4">
        <h2 class="mb-2 text-xl font-bold text-primary">What to Know</h2>
        <ul class="ml-4 list-disc">
          <li>Enter a Pokémon's name above to add it to your dex.</li>
          <li>Click on a Pokémon you've added to change its type or settings.</li>
          <li>Drag and drop Pokémon you've added to reorder them.</li>
          <li>You will be given recommendations and statistics based on your Pokédex.</li>
        </ul>
      </div>
      <div class="rounded-b-md border-2 border-t-0 border-primary p-4">
        <h3 class="mb-2 text-lg font-bold text-primary">Other Ways to Start</h3>
        <ul class="ml-4 list-disc">
          <li>
            <UploadLink accept="text/plain,application/json" onUpload={loadSaveJSONOrText}>
              Import a Stardex project.
            </UploadLink>
          </li>
          <li>
            <UploadLink accept="text/plain" multiple onUpload={pbsImport.import}>
              Import Essentials <code>pokemon.txt</code> files.
            </UploadLink>
          </li>
          <li>
            <ButtonLink onClick={() => (importRegionModalOpen.value = true)}>
              Start from a canon region.
            </ButtonLink>
          </li>
        </ul>
      </div>

      {/* TODO: Implement import. */}

      <Show when={pbsImport.error}>
        {(error) => <ImportPBSErrorModal error={error} onClose={() => pbsImport.closeError()} />}
      </Show>

      <Show when={importRegionModalOpen}>
        <ImportRegionModal onClose={() => (importRegionModalOpen.value = false)} />
      </Show>
    </>
  );
}
