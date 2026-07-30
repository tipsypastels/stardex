import { batch, createSignal, For, Show } from "solid-js";
import { capitalizeWords } from "../../../../utils/string";
import { Button, UploadButton } from "../../../common/button";
import { Checkbox } from "../../../common/forms/checkbox";
import { ButtonLink } from "../../../common/link";
import type { ImportPBSDexesPhase, ImportPBSState } from "./state";

export interface ImportPBSModalDexesProps {
  state: ImportPBSState;
  phase: ImportPBSDexesPhase;
}

export function ImportPBSModalDexes(props: ImportPBSModalDexesProps) {
  const intro = (
    <p class="mb-2">
      <code>pokemon.txt</code> files define <em>every</em> Pokémon that exists in the game, but
      Stardex is best used with one project per region/Pokédex.
    </p>
  );

  return (
    <Show
      when={props.phase.files.parsed.dexes.size > 0}
      fallback={
        <>
          {intro}
          <p>
            You can upload your <code>regional_dexes.txt</code> and choose a region. Pokémon not in
            that region won't be added to this Stardex project.
          </p>
        </>
      }
    >
      {intro}
      <p class="mb-2">
        Choose a Pokédex from your <code>regional_dexes.txt</code>. Pokémon not in that dex won't be
        added to this Stardex project.
      </p>

      <ul>
        <For each={[...props.phase.files.parsed.dexes.values()]}>
          {(dex) => (
            <li>
              <Checkbox
                name={
                  <>
                    Dex {dex.section}{" "}
                    <span class="text-foreground-muted">
                      ({dex.pokemonSections.slice(0, 3).map(capitalizeWords).join(", ")}...)
                    </span>
                  </>
                }
                radio
                checked={props.phase.dexes.section === dex.section}
                onChange={() => props.phase.dexes.setSection(dex.section)}
              />
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
}

export function ImportPBSModalDexesFooter(props: ImportPBSModalDexesProps) {
  return (
    <Show when={props.phase.files.parsed.dexes.size > 0} fallback={<FooterOnNoDexes {...props} />}>
      <FooterOnDexes {...props} />
    </Show>
  );
}

function FooterOnDexes(props: ImportPBSModalDexesProps) {
  return (
    <>
      <div class="mb-2 flex flex-col justify-center">
        <Button
          onClick={() => props.state.gotoForms()}
          disabled={props.phase.dexes.section == null}
        >
          Continue
        </Button>
      </div>

      <div class="text-center text-sm text-foreground-muted">
        Or,{" "}
        <ButtonLink
          onClick={() => {
            batch(() => {
              props.phase.dexes.setSection(undefined);
              props.state.gotoForms();
            });
          }}
        >
          skip this option
        </ButtonLink>{" "}
        to add <strong>{props.phase.files.parsed.pokemons.size}</strong> Pokémon to your project.
      </div>
    </>
  );
}

function FooterOnNoDexes(props: ImportPBSModalDexesProps) {
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
            await props.phase.files.import(fileList);
            setUploading(false);
          }}
        >
          Upload Regional Dexes
        </UploadButton>
      </div>

      <div class="text-center text-sm text-foreground-muted">
        Or, <ButtonLink onClick={() => props.state.gotoForms()}>skip this option</ButtonLink> to add{" "}
        <strong>{props.phase.files.parsed.pokemons.size}</strong> Pokémon to your project.
      </div>
    </>
  );
}
