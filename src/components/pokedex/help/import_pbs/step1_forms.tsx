import { batch, Show } from "solid-js";
import type { ImportPBSStepProps } from ".";
import { Button, UploadButton } from "../../../common/button";
import { Checkbox } from "../../../common/forms/checkbox";
import { ButtonLink } from "../../../common/link";
import { SpeciesIcon } from "../../util/species_icon";

export function ImportPBSStep1Forms(props: ImportPBSStepProps) {
  return (
    <Show
      when={props.parsed.formsCount > 0}
      fallback={
        <>
          <p class="mb-2">
            Stardex supports Pokémon forms. You can upload your <code>pokemon_forms.txt</code> to
            add some or all of them to your Pokédex.
          </p>

          <p class="mb-4">
            You aren't obliged to care about forms with Stardex. If your region has none or it's too
            much effort to account for them, you can safely skip this option.
          </p>

          <div class="mb-4 flex flex-col justify-center">
            <UploadButton accept="text/plain" multiple onUpload={props.state.import}>
              Upload Pokémon Forms
            </UploadButton>
          </div>

          <div class="text-center text-sm text-foreground-muted">
            Or, <ButtonLink onClick={() => props.state.advance()}>skip this option</ButtonLink> to
            only import base forms.
          </div>
        </>
      }
    >
      <p class="mb-2">
        Stardex's built-in Pokémon list only contains <strong>non-cosmetic</strong> forms. By
        contrast, <code>pokemon_forms.txt</code> makes no distinction between the two kinds of
        forms.
      </p>

      <div class="mb-2 flex text-base text-foreground-muted">
        <div class="flex grow flex-col items-center">
          <strong>Cosmetic Forms</strong>
          <div class="flex">
            <SpeciesIcon id={1037} name="Pikachu (Popstar)" />
            <SpeciesIcon id={1090} name="Deerling (Autumn)" />
          </div>
        </div>
        <div class="flex grow flex-col items-center">
          <strong>Non-Cosmetic Forms</strong>
          <div class="flex">
            <SpeciesIcon id={1159} name="Dugtrio (Alolan)" />
            <SpeciesIcon id={1345} name="Sableye (Mega)" />
          </div>
        </div>
      </div>

      <p class="mb-2">
        You can still import cosmetic forms into Stardex, or even custom forms. Cosmetic forms will
        be considered custom forms, and won't have icons by default.
      </p>

      <p class="mb-2">
        Which forms from <code>pokemon_forms.txt</code> do you want to add to your project's
        Pokédex?
      </p>

      <ul class="mb-2">
        <li>
          <Checkbox
            name="All of them."
            radio
            checked={props.state.formGranularity?.type === "all"}
            onChange={() => props.state.setFormGranularity({ type: "all" })}
          />
        </li>
        <li>
          <Checkbox
            name="Only forms that change types."
            radio
            checked={props.state.formGranularity?.type === "has-types"}
            onChange={() => props.state.setFormGranularity({ type: "has-types" })}
          />
        </li>
        <li>
          <Checkbox
            name="Only non-cosmetic forms Stardex recognizes."
            radio
            checked={props.state.formGranularity?.type === "known"}
            onChange={() => props.state.setFormGranularity({ type: "known" })}
          />
        </li>
        <li>
          <Checkbox
            name="Let me decide for each form."
            radio
            checked={props.state.formGranularity?.type === "advanced"}
            onChange={() => props.state.setFormGranularity({ type: "advanced" })}
          />
        </li>
      </ul>

      <div class="mb-4 text-sm text-foreground-muted">
        <strong>Note:</strong> Forms without a <code class="text-xs">FormName</code> are always
        ignored, regardless of your choice here.
      </div>

      <div class="mb-4 flex flex-col justify-center">
        <Button onClick={() => props.state.advance()} disabled={!props.state.formGranularity}>
          Continue
        </Button>
      </div>

      <div class="text-center text-sm text-foreground-muted">
        Or,{" "}
        <ButtonLink
          onClick={() => {
            batch(() => {
              props.state.setFormGranularity(undefined);
              props.state.advance();
            });
          }}
        >
          skip this option
        </ButtonLink>{" "}
        to only import base forms.
      </div>
    </Show>
  );
}
