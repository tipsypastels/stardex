import { batch, createSignal, Show } from "solid-js";
import * as v from "valibot";
import { loadJSONExport, VAny_RawJSONExport } from "../../../models/export";
import { pokedexMode } from "../../../models/pokedex/mode";
import { PokemonIdDump } from "../../../models/pokemon/id_dump";
import { pokemons } from "../../../models/pokemon/list";
import { parsePokemonListText } from "../../../models/pokemon/text/parse";
import { toasts } from "../../../models/ui/toast";
import { readFileAsTextAsync } from "../../../utils/fs/web";
import { ButtonLink, UploadLink } from "../../common/link";
import { Modal } from "../../common/menus/modal";
import { PokedexEmptyImportError } from "./error";
import { ImportPBSModal } from "./import_pbs";
import { createImportPBSState } from "./import_pbs/state";
import { ImportRegionModal } from "./import_region";
import { PokedexEmptyTutorial } from "./tutorial";

export interface PokedexEmptyProps {
  afterActionChange(): void;
}

export function PokedexEmpty(props: PokedexEmptyProps) {
  const [manuallyOpened, setManuallyOpened] = createSignal(false);
  const [importRegionModalOpen, setImportRegionModalOpen] = createSignal(false);
  const [importError, setImportError] = createSignal<unknown>();

  const pbsState = createImportPBSState(() => {
    if (pokemons.all.length === 0) return;
    return new PokemonIdDump(pokemons.toRaw().all);
  });

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

        props.afterActionChange?.();
      } catch (error) {
        setImportError(error);
      }
    } else if (file.type === "text/plain") {
      // NOTE: We ignore errors here. If they're in text mode
      // they'll see the errors soon anyways and if not they're not relevant.
      const { list } = parsePokemonListText(text);
      pokemons.setFromRaw(list);
      props.afterActionChange();
    } else {
      alert("Unknown file format.");
    }
  }

  return (
    <Show
      when={pokemons.all.length === 0}
      fallback={
        <>
          <div class="mt-2 text-right">
            <ButtonLink onClick={() => setManuallyOpened(true)} small>
              Need help?
            </ButtonLink>
          </div>

          <Show when={manuallyOpened()}>
            <Modal title="What to Know" onClose={() => setManuallyOpened(false)}>
              <PokedexEmptyTutorial />
            </Modal>
          </Show>
        </>
      }
    >
      <div
        class="mt-4 rounded-t-md border-2 border-primary p-4"
        classList={{ "mb-2 rounded-b-md": pokemons.all.length > 0 }}
      >
        <h2 class="mb-2 text-xl font-bold text-primary">What to Know</h2>
        <PokedexEmptyTutorial />
      </div>

      <div class="rounded-b-md border-2 border-t-0 border-primary p-4">
        <h3 class="mb-2 text-lg font-bold text-primary">Other Ways to Start</h3>
        <ul class="ml-4 list-disc">
          <li>
            <UploadLink accept="text/plain,application/json" onUpload={loadJSONOrTextExport}>
              Import a Stardex project.
            </UploadLink>
          </li>
          <li>
            <ButtonLink onClick={() => pbsState.open()}>Import Essentials PBS files.</ButtonLink>
          </li>
          <li>
            <ButtonLink onClick={() => setImportRegionModalOpen(true)}>
              Start from a canon region.
            </ButtonLink>
          </li>
        </ul>
      </div>

      <Show when={pokedexMode.key !== "text"}>
        <div class="mt-2 text-center text-base text-foreground-muted">
          Don't want a visual editor? Try out{" "}
          <ButtonLink onClick={() => (pokedexMode.key = "text")}>text editor mode</ButtonLink> for
          an improved version of the{" "}
          <span class="transition-colors duration-200 hover:text-[#FB5687]">old Stardex</span>{" "}
          experience.
        </div>
      </Show>

      <Show when={pbsState.phase}>
        {(phase) => (
          <ImportPBSModal state={pbsState} phase={phase()} afterImport={props.afterActionChange} />
        )}
      </Show>

      <Show when={importRegionModalOpen()}>
        <ImportRegionModal
          onClose={() => setImportRegionModalOpen(false)}
          afterImport={props.afterActionChange}
        />
      </Show>

      <Show when={importError()}>
        {(error) => (
          <PokedexEmptyImportError error={error()} onClose={() => setImportError(undefined)} />
        )}
      </Show>
    </Show>
  );
}
