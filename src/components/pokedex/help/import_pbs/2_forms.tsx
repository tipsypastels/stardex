import { createSignal, Show } from "solid-js";
import { UploadButton } from "../../../common/button";
import { Checkbox } from "../../../common/forms/checkbox";
import { ButtonLink } from "../../../common/link";
import { SpeciesIcon } from "../../util/species_icon";
import type { ImportPBSFormsPhase, ImportPBSState } from "./state";

export interface ImportPBSModalFormsProps {
  state: ImportPBSState;
  phase: ImportPBSFormsPhase;
}

export function ImportPBSModalForms(props: ImportPBSModalFormsProps) {
  return (
    <Show
      when={props.phase.files.parsed.forms.length > 0}
      fallback={
        <>
          <p class="mb-2">
            Stardex supports Pokémon forms. You can upload your <code>pokemon_forms.txt</code> to
            add some or all of them to your Pokédex.
          </p>

          <p class="mb-4">
            You aren't obliged to care about forms with Stardex. If your region has none, they're
            all cosmetic, or it's too much effort to account for them, you can safely skip this
            option.
          </p>
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
            checked={props.phase.forms.granularity === "all"}
            onChange={() => props.phase.forms.setGranularity("all")}
          />
        </li>
        <li>
          <Checkbox
            name="Only forms that change types."
            radio
            checked={props.phase.forms.granularity === "types"}
            onChange={() => props.phase.forms.setGranularity("types")}
          />
        </li>
        <li>
          <Checkbox
            name="Only forms Stardex recognizes."
            radio
            checked={props.phase.forms.granularity === "known"}
            onChange={() => props.phase.forms.setGranularity("known")}
          />
        </li>
        <li>
          <Checkbox
            name="Let me decide for each form class."
            radio
            checked={props.phase.forms.granularity === "custom"}
            onChange={() => props.phase.forms.setGranularity("custom")}
          />
        </li>
      </ul>

      <Show
        when={props.phase.forms.granularity === "custom"}
        fallback={
          <div class="text-sm text-foreground-muted">
            <strong>Note:</strong> Forms without a <code class="text-xs">FormName</code> are always
            ignored, regardless of your choice here.
          </div>
        }
      >
        okay...
        {/* <Switch>
          <Match></Match>
        </Switch>
        {renderGranularityAdvancedPickView(props.state)} */}
      </Show>
    </Show>
  );
}

export function ImportPBSModalFormsFooter(props: ImportPBSModalFormsProps) {
  return (
    <Show when={props.phase.files.parsed.forms.length > 0} fallback={<FooterNoForms {...props} />}>
      <FooterOnForms {...props} />
    </Show>
  );
}

function FooterOnForms(props: ImportPBSModalFormsProps) {
  return "continue";
}

function FooterNoForms(props: ImportPBSModalFormsProps) {
  const [uploading, setUploading] = createSignal(false);
  return (
    <>
      <div class="mb-2 flex flex-col justify-center">
        <UploadButton
          accept="text/plain"
          multiple
          disabled={uploading()}
          onUpload={(fileList) => {
            setUploading(true);
            props.phase.files.import(fileList);
          }}
        >
          Upload Pokémon Forms
        </UploadButton>
      </div>

      <div class="text-center text-sm text-foreground-muted">
        Or, <ButtonLink onClick={() => props.state.gotoForms()}>skip this option</ButtonLink> to
        import only base forms.
      </div>
    </>
  );
}
