import { createSignal, Show } from "solid-js";
import { pokedexMode } from "../../models/pokedex/mode";
import { pokemons } from "../../models/pokemon/list";
import { ButtonLink, UploadLink } from "../common/link";
import { Modal } from "../common/menus/modal";
import { PokedexImport } from "./import";

export interface PokedexEmptyProps {
  afterActionChange(): void;
}

export function PokedexEmpty(props: PokedexEmptyProps) {
  const [manuallyOpened, setManuallyOpened] = createSignal(false);

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
              <Tutorial />
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
        <Tutorial />
      </div>

      <div class="rounded-b-md border-2 border-t-0 border-primary p-4">
        <h3 class="mb-2 text-lg font-bold text-primary">Other Ways to Start</h3>
        <PokedexImport afterImport={props.afterActionChange}>
          {(importActions) => (
            <ul class="ml-4 list-disc">
              <li>
                <UploadLink
                  accept="text/plain,application/json"
                  onUpload={importActions.openProject}
                >
                  Import a Stardex project.
                </UploadLink>
              </li>
              <li>
                <ButtonLink onClick={importActions.openPBS}>
                  Import Essentials PBS files.
                </ButtonLink>
              </li>
              <li>
                <ButtonLink onClick={importActions.openRegion}>
                  Start from a canon region.
                </ButtonLink>
              </li>
            </ul>
          )}
        </PokedexImport>
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
    </Show>
  );
}

function Tutorial() {
  return (
    <ul class="ml-4 list-disc">
      <Show
        when={pokedexMode.key === "text"}
        fallback={
          <>
            <li>Enter a Pokémon's name above to add it to your dex.</li>
            <li>Click on a Pokémon you've added to change its type, form, or settings.</li>
            <li>Drag and drop Pokémon you've added to reorder them.</li>
            <li>You'll be given recommendations and statistics based on your Pokédex.</li>
          </>
        }
      >
        <li>Type or paste in one Pokémon name per line.</li>
        <li>Autocomplete suggestions will be provided as you type.</li>
        <li>
          Blank lines are ignored, as are comments, which start with{" "}
          <code class="text-sm text-editor-comment">#</code>.
        </li>
        <li>
          To set a Pokémon's type, write it after the name in parentheses:
          <ul class="ml-6 list-disc">
            <li>
              <code class="text-sm">
                <span class="text-editor-name">Oshawott</span>{" "}
                <span class="text-editor-punctuation">(</span>
                <span class="text-editor-type-name">Fire</span>
                <span class="text-editor-punctuation">)</span>
              </code>
            </li>
            <li>
              <code class="text-sm">
                <span class="text-editor-name">Xatu</span>{" "}
                <span class="text-editor-punctuation">(</span>
                <span class="text-editor-type-name">MyCustomType</span>
                <span class="text-editor-punctuation">/</span>
                <span class="text-editor-type-name">Flying</span>
                <span class="text-editor-punctuation">)</span>
              </code>
            </li>
          </ul>
        </li>
        <li>
          To set a Pokémon's form name, write it in those same parentheses, followed by a colon:
          <ul class="ml-6 list-disc">
            <li>
              <code class="text-sm">
                <span class="text-editor-name">Zoroark</span>{" "}
                <span class="text-editor-punctuation">(</span>
                <span class="text-editor-alt-name">Hisuian</span>
                <span class="text-editor-punctuation">:)</span>
              </code>
            </li>
            <li>
              <code class="text-sm">
                <span class="text-editor-name">Raichu</span>{" "}
                <span class="text-editor-punctuation">(</span>
                <span class="text-editor-alt-name">Mega Y</span>
                <span class="text-editor-punctuation">:)</span>
              </code>
            </li>
            <li>
              <code class="text-sm">
                <span class="text-editor-name">Politoed</span>{" "}
                <span class="text-editor-punctuation">(</span>
                <span class="text-editor-alt-name">MyRegionian</span>
                <span class="text-editor-punctuation">:</span>
                <span class="text-editor-type-name">Water</span>
                <span class="text-editor-punctuation">/</span>
                <span class="text-editor-type-name">Grass</span>
                <span class="text-editor-punctuation">)</span>
              </code>
            </li>
          </ul>
        </li>
        <li>You'll be given recommendations and statistics based on your Pokédex.</li>
        <li>
          To exclude a Pokémon from recommendations, write{" "}
          <code class="text-sm text-editor-modifier">@exclude</code> or{" "}
          <code class="text-sm text-editor-modifier">@ignore</code> after its name:
          <ul class="ml-6 list-disc">
            <li>
              <code class="text-sm">
                <span class="text-editor-name">MySpecialLegendary</span>{" "}
                <span class="text-editor-punctuation">(</span>
                <span class="text-editor-type-name">Fairy</span>
                <span class="text-editor-punctuation">/</span>
                <span class="text-editor-type-name">Normal</span>
                <span class="text-editor-punctuation">)</span>{" "}
                <span class="text-editor-modifier">@exclude</span>
              </code>
            </li>
          </ul>
        </li>
      </Show>
    </ul>
  );
}
