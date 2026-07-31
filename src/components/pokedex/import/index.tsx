import { batch, createSignal, Show, type JSXElement } from "solid-js";
import * as v from "valibot";
import { loadJSONExport, VAny_RawJSONExport } from "../../../models/export";
import { PokemonIdDump } from "../../../models/pokemon/id_dump";
import { pokemons } from "../../../models/pokemon/list";
import { parsePokemonListText } from "../../../models/pokemon/text/parse";
import { toasts } from "../../../models/ui/toast";
import { readFileAsTextAsync } from "../../../utils/fs/web";
import { ButtonLink, Link, UploadLink } from "../../common/link";
import { Modal } from "../../common/menus/modal";
import { ImportPBSModal } from "./pbs";
import { createImportPBSState } from "./pbs/state";
import { ImportRegionModal } from "./region";

export interface PokedexImportProps {
  children?(instructions: JSXElement): JSXElement;
  afterImport(): void;
}

export function PokedexImport(props: PokedexImportProps) {
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

        props.afterImport();
      } catch (error) {
        setImportError(error);
      }
    } else if (file.type === "text/plain") {
      // NOTE: We ignore errors here. If they're in text mode
      // they'll see the errors soon anyways and if not they're not relevant.
      const { list } = parsePokemonListText(text);
      pokemons.setFromRaw(list);
      props.afterImport();
    } else {
      alert("Unknown file format.");
    }
  }

  const instructions = (
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
  );

  return (
    <>
      {props.children ? props.children(instructions) : instructions}

      <Show when={pbsState.phase}>
        {(phase) => (
          <ImportPBSModal state={pbsState} phase={phase()} afterImport={props.afterImport} />
        )}
      </Show>

      <Show when={importRegionModalOpen()}>
        <ImportRegionModal
          onClose={() => setImportRegionModalOpen(false)}
          afterImport={props.afterImport}
        />
      </Show>

      <Show when={importError()}>
        <Modal title="Invalid Project" onClose={() => setImportError(undefined)}>
          <p class="mb-2">This project is corrupted and could not be loaded.</p>
          <p>
            This may be a bug with Stardex. You can open an issue at the{" "}
            <Link blank to="https://github.com/tipsypastels/stardex">
              project GitHub
            </Link>{" "}
            with the project file to help me diagnose it.
          </p>
        </Modal>
      </Show>
    </>
  );
}
