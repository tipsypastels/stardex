import { batch, Match, Show, Switch } from "solid-js";
import type { ImportPBSStepProps } from ".";
import type { PBSFormFilterBucket } from "../../../../models/pokemon/pbs/form";
import { Button, UploadButton } from "../../../common/button";
import { Checkbox } from "../../../common/forms/checkbox";
import { Icon } from "../../../common/icon";
import { ButtonLink } from "../../../common/link";
import { SpeciesIcon } from "../../util/species_icon";
import type { ImportPBSState } from "./state";

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
            name="Only forms Stardex recognizes."
            radio
            checked={props.state.formGranularity?.type === "known"}
            onChange={() => props.state.setFormGranularity({ type: "known" })}
          />
        </li>
        <li>
          <Checkbox
            name="Let me decide for each form class."
            radio
            checked={props.state.formGranularity?.type === "advanced"}
            onChange={() => props.state.setFormGranularity({ type: "advanced", decisions: [] })}
          />
        </li>
      </ul>

      <div class="mb-4">
        <Show
          when={props.state.formGranularity?.type === "advanced"}
          fallback={
            <div class="text-sm text-foreground-muted">
              <strong>Note:</strong> Forms without a <code class="text-xs">FormName</code> are
              always ignored, regardless of your choice here.
            </div>
          }
        >
          {renderGranularityAdvancedPickView(props.state)}
        </Show>
      </div>

      <div class="mb-4 flex flex-col justify-center">
        <Button
          onClick={() => props.state.advance()}
          disabled={!props.state.formGranularityIsSubmittable}
        >
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

function renderGranularityAdvancedPickView(state: ImportPBSState) {
  switch (state.formGranularityAdvancedPickView.type) {
    case "loading": {
      return "TODO Loading";
    }
    case "done": {
      return "TODO done";
    }
    case "bucket": {
      return <FilterBuckets state={state} {...state.formGranularityAdvancedPickView} />;
    }
  }
}

interface FilterBucketsProps {
  state: ImportPBSState;
  bucket: PBSFormFilterBucket;
  index: number;
  total: number;
}

function FilterBuckets(props: FilterBucketsProps) {
  function renderKnown() {
    const knownCount = props.bucket.entries.filter((entry) =>
      entry.resolutionInfo.kind.startsWith("known"),
    ).length;

    return (
      <li>
        <span class="mr-1">Recognized by Stardex?</span>
        <Switch
          fallback={
            <span class="text-warning">
              <Icon name="tilde" /> Some
            </span>
          }
        >
          <Match when={knownCount === props.bucket.entries.length}>
            <span class="text-primary">
              <Icon name="check" /> Yes
            </span>
          </Match>
          <Match when={knownCount === 0}>
            <span class="text-error">
              <Icon name="times" /> No
            </span>
          </Match>
        </Switch>
      </li>
    );
  }

  return (
    <div class="relative rounded-md border-2 border-divider-heavy p-4">
      <div class="absolute -top-2.5 left-4 bg-background px-2 text-xs">
        {props.index + 1} / {props.total}
      </div>
      <Show when={props.index}>
        <div class="absolute -top-2.5 right-4 bg-background px-2 text-xs">
          <ButtonLink onClick={() => props.state.undoFormGranularityAdvancedDecision()}>
            Undo
          </ButtonLink>
        </div>
      </Show>
      <div>
        {props.bucket.groupedBy === "formName" ? (
          <>
            <strong>Form:</strong> {props.bucket.formName}
            <ul class="list-inside list-disc text-sm text-foreground-muted">
              <li>
                <strong>{props.bucket.entries.length}</strong> Pokémon have this form.
              </li>
              {renderKnown()}
            </ul>
          </>
        ) : (
          <>
            <strong>
              Forms of {props.bucket.speciesNames.length === 1 ? "Pokémon" : "Family"}:
            </strong>{" "}
            {props.bucket.speciesNames[0]}
            <ul class="list-inside list-disc text-sm text-foreground-muted">
              <li>
                <strong>{props.bucket.entries.length}</strong> unique form
                {props.bucket.entries.length === 1 ? "" : "s"} in this family.
              </li>
              {renderKnown()}
            </ul>
          </>
        )}
      </div>
      <div
        class="absolute -bottom-2.5 bg-background px-2 text-center whitespace-nowrap"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
        <ButtonLink onClick={() => props.state.pushFormGranularityAdvancedDecision("keep")}>
          Keep
        </ButtonLink>
        <span class="text-foreground-muted">{" / "}</span>
        <ButtonLink onClick={() => props.state.pushFormGranularityAdvancedDecision("replace")}>
          Replace Base
        </ButtonLink>
        <span class="text-foreground-muted">{" / "}</span>
        <ButtonLink
          onClick={() => props.state.pushFormGranularityAdvancedDecision("omit")}
          look="warning"
        >
          Omit
        </ButtonLink>
      </div>
    </div>
  );
}
