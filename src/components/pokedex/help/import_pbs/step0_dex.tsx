import { batch, For, Show } from "solid-js";
import type { ImportPBSStepProps } from ".";
import { Button, UploadButton } from "../../../common/button";
import { Checkbox } from "../../../common/forms/checkbox";
import { ButtonLink } from "../../../common/link";

export function ImportPBSStep0Dex(props: ImportPBSStepProps) {
  const intro = (
    <>
      <code>pokemon.txt</code> files define <em>every</em> Pokémon that exists in the game, but
      Stardex is best used with one project per region/Pokédex.
    </>
  );

  return (
    <Show
      when={props.parsed.dexes.length > 0}
      fallback={
        <>
          <p class="mb-2">{intro}</p>
          <p class="mb-4">
            You can upload your <code>regional_dexes.txt</code> and choose a region. Pokémon not in
            that region won't be added to this Stardex project.
          </p>

          <div class="mb-4 flex flex-col justify-center">
            <UploadButton accept="text/plain" multiple onUpload={props.state.import}>
              Upload Regional Dexes
            </UploadButton>
          </div>

          <div class="text-center text-sm text-foreground-muted">
            Or, <ButtonLink onClick={() => props.state.advance()}>skip this option</ButtonLink> to
            add <strong>{props.parsed.pokemonsCount}</strong> Pokémon to your project.
          </div>
        </>
      }
    >
      <p class="mb-2">{intro}</p>
      <p class="mb-2">
        Choose a region from your <code>regional_dexes.txt</code>. Pokémon not in that region won't
        be added to this Stardex project.
      </p>

      <ul class="mb-4">
        <For each={props.parsed.dexes}>
          {(dex) => (
            <li>
              <Checkbox
                name={
                  <>
                    Dex {dex.section}{" "}
                    <span class="text-foreground-muted lowercase">
                      ({dex.labels.slice(0, 3).join(", ")}...)
                    </span>
                  </>
                }
                radio
                checked={props.state.filteredDexSection === dex.section}
                onChange={() => props.state.setFilteredDexSection(dex.section)}
              />
            </li>
          )}
        </For>
      </ul>

      <div class="mb-4 flex flex-col justify-center">
        <Button
          onClick={() => props.state.advance()}
          disabled={props.state.filteredDexSection == null}
        >
          Continue
        </Button>
      </div>

      <div class="text-center text-sm text-foreground-muted">
        Or,{" "}
        <ButtonLink
          onClick={() => {
            batch(() => {
              props.state.setFilteredDexSection(undefined);
              props.state.advance();
            });
          }}
        >
          skip this option
        </ButtonLink>{" "}
        to add <strong>{props.parsed.pokemonsCount}</strong> Pokémon to your project.
      </div>
    </Show>
  );
}
