import { batch, createSignal, Show } from "solid-js";
import * as v from "valibot";
import { loadJSONExport, VAny_RawJSONExport } from "../../../models/export";
import { pokedexMode } from "../../../models/pokedex/mode";
import { toasts } from "../../../models/ui/toast";
import { readFileAsTextAsync } from "../../../utils/file";
import { ButtonLink, UploadLink } from "../../common/link";
import { createPBSState, ImportPBSErrorModal } from "./import_pbs";
import { ImportRegionModal } from "./import_region";

export function EmptyPokedex() {
  const [importRegionModalOpen, setImportRegionModalOpen] = createSignal(false);
  const pbsState = createPBSState();

  async function loadJSONOrTextExport([file]: FileList) {
    if (!file) return;

    const text = await readFileAsTextAsync(file);

    if (file.type === "application/json") {
      try {
        const data = JSON.parse(text) as unknown;
        const jsonExport = v.parse(VAny_RawJSONExport, data);

        batch(() => {
          loadJSONExport(jsonExport);
          toasts.add("upload", "Save file loaded!");
        });
      } catch {
        // TODO: Display a late validation error.
        alert("Error!");
      }
    } else if (file.type === "text/plain") {
      alert("TODO: Importing text files.");
    } else {
      alert("Unknown file format.");
    }
    // TODO
    // if (!file) return;
    // const fileReader = new FileReader();
    // fileReader.onload = () => {
    //   const text = fileReader.result as string;
    //   if (file.type === "application/json") {
    //     batch(() => {
    //       saver.load(JSON.parse(text));
    //       toasts.add("upload", "Save file loaded!");
    //     });
    //   } else {
    //     const result = parsePokemonListText(text);
    //     batch(() => {
    //       pokemons.setFromRaw({
    //         v: POKEMON_LIST_VERSION,
    //         all: result.pokemons,
    //         textDiff: result.textDiff,
    //       });
    //       toasts.add("upload", "Save file loaded!");
    //     });
    //   }
    // };
    // fileReader.readAsText(file);
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
      <div class="mb-2 rounded-b-md border-2 border-t-0 border-primary p-4">
        <h3 class="mb-2 text-lg font-bold text-primary">Other Ways to Start</h3>
        <ul class="ml-4 list-disc">
          <li>
            <UploadLink accept="text/plain,application/json" onUpload={loadJSONOrTextExport}>
              Import a Stardex project.
            </UploadLink>
          </li>
          <li>
            <UploadLink accept="text/plain" multiple onUpload={pbsState.import}>
              Import Essentials <code>pokemon.txt</code> files.
            </UploadLink>
          </li>
          <li>
            <ButtonLink onClick={() => setImportRegionModalOpen(true)}>
              Start from a canon region.
            </ButtonLink>
          </li>
        </ul>
      </div>

      <div class="text-center text-base text-foreground-lesser">
        Don't want a visual editor? Try out{" "}
        <ButtonLink onClick={() => (pokedexMode.key = "text")}>text mode</ButtonLink> for an
        improved version of the{" "}
        <span class="transition-colors duration-200 hover:text-[#FB5687]">old Stardex</span>{" "}
        experience.
      </div>

      <Show when={pbsState.error}>
        {(error) => <ImportPBSErrorModal error={error()} onClose={() => pbsState.closeError()} />}
      </Show>

      <Show when={importRegionModalOpen()}>
        <ImportRegionModal onClose={() => setImportRegionModalOpen(false)} />
      </Show>
    </>
  );
}
