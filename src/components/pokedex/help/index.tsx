import { batch, createSignal, Show } from "solid-js";
import * as v from "valibot";
import { loadJSONExport, VAny_RawJSONExport } from "../../../models/export";
import { pokedexMode } from "../../../models/pokedex/mode";
import { pokemons } from "../../../models/pokemon/list";
import { toasts } from "../../../models/ui/toast";
import { readFileAsTextAsync } from "../../../utils/file";
import { ButtonIcon } from "../../common/button";
import { ButtonLink, UploadLink } from "../../common/link";
import { createPBSState, ImportPBSErrorModal } from "./import_pbs";
import { ImportRegionModal } from "./import_region";

export function PokedexHelp() {
  const [manuallyOpened, setManuallyOpened] = createSignal(false);
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
    <Show
      when={pokemons.all.length === 0 || manuallyOpened()}
      fallback={
        <Show when={pokemons.all.length > 0}>
          <div class="text-right">
            <ButtonLink onClick={() => setManuallyOpened(true)} small>
              Need help?
            </ButtonLink>
          </div>
        </Show>
      }
    >
      <div
        class="mt-8 rounded-t-md border-2 border-primary p-4"
        classList={{ "mb-2 rounded-b-md": pokemons.all.length > 0 }}
      >
        <div class="flex">
          <h2 class="mb-2 grow text-xl font-bold text-primary">What to Know</h2>

          <Show when={pokemons.all.length > 0}>
            <ButtonIcon icon="times" label="Close" onClick={() => setManuallyOpened(false)} />
          </Show>
        </div>
        <ul class="ml-4 list-disc">
          <Show
            when={pokedexMode.key === "text"}
            fallback={
              <>
                <li>Enter a Pokémon's name above to add it to your dex.</li>
                <li>Click on a Pokémon you've added to change its type or settings.</li>
                <li>Drag and drop Pokémon you've added to reorder them.</li>
                <li>You'll be given recommendations and statistics based on your Pokédex.</li>
              </>
            }
          >
            <li>Type in a Pokémon's name above to add it to your dex.</li>
            <li>Autocomplete suggestions will be provided as you type.</li>
            <li>
              Blank lines are ignored, as are comments, which start with <code>#</code>.
            </li>
            <li>
              To set a Pokémon's type, write it after the name in parentheses:
              <ul class="ml-6 list-disc">
                <li>
                  <code>Oshawott (Fire)</code>
                </li>
                <li>
                  <code>Xatu (MyCustomType/Flying)</code>
                </li>
              </ul>
            </li>
            <li>
              To set a Pokémon's form name, write it in those same parentheses, followed by a colon:
              <ul class="ml-6 list-disc">
                <li>
                  <code>Zoroark (Hisuian:)</code>
                </li>
                <li>
                  <code>Raichu (Mega Y:)</code>
                </li>
                <li>
                  <code>Politoed (MyRegionian:Water/Grass)</code>
                </li>
              </ul>
            </li>
            <li>You'll be given recommendations and statistics based on your Pokédex.</li>
            <li>
              To exclude a Pokémon from recommendations, write <code>@exclude</code> or{" "}
              <code>@ignore</code> after its name:
              <ul class="ml-6 list-disc">
                <li>
                  <code>MySpecialLegendary (Fairy/Normal) @exclude</code>
                </li>
              </ul>
            </li>
          </Show>
        </ul>
      </div>

      <Show when={pokemons.all.length === 0}>
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
            <Show when={pokedexMode.key === "text"}>
              <li>
                <ButtonLink onClick={() => {}}>
                  Start from a sample project to learn the syntax.
                </ButtonLink>
              </li>
            </Show>
          </ul>
        </div>
      </Show>

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
    </Show>
  );
}
