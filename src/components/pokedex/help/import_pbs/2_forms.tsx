import { batch, createMemo, createSignal, Match, Show, Switch } from "solid-js";
import type {
  PBSFormFilterBucket,
  PBSFormFilterBucketByFormName,
  PBSFormFilterBucketByLine,
  PBSFormFilterBucketEntry,
} from "../../../../models/pokemon/pbs/form";
import { SPECIES } from "../../../../models/pokemon/species";
import { Button, UploadButton } from "../../../common/button";
import { Checkbox } from "../../../common/forms/checkbox";
import { Icon } from "../../../common/icon";
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

          <p>
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
        <Custom {...props} />
      </Show>
    </Show>
  );
}

/* ------------------------------ Custom Filter ----------------------------- */

function Custom(props: ImportPBSModalFormsProps) {
  return (
    <Show when={props.phase.forms.customBuckets} fallback="TODO Loading">
      {(buckets) => (
        <Show
          when={buckets().length === props.phase.forms.customChoices.length}
          fallback={<CustomInner {...props} buckets={buckets()} />}
        >
          TODO done
        </Show>
      )}
    </Show>
  );
}

interface CustomInnerProps extends ImportPBSModalFormsProps {
  buckets: PBSFormFilterBucket[];
}

export function CustomInner(props: CustomInnerProps) {
  const view = {
    get index() {
      return props.phase.forms.customChoices.length;
    },
    get total() {
      return props.buckets.length;
    },
    get bucket() {
      return props.buckets[this.index];
    },
  };

  function renderKnown() {
    const knownCount = view.bucket.entries.filter((entry) =>
      entry.resolutionInfo.kind.startsWith("known"),
    ).length;

    return (
      <>
        <span class="mr-1">Recognized by Stardex?</span>
        <Switch
          fallback={
            <span class="text-warning">
              <Icon name="tilde" /> Some
            </span>
          }
        >
          <Match when={knownCount === view.bucket.entries.length}>
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
      </>
    );
  }

  function renderNameList<T>(inputs: T[], toName: (input: T) => string, show: number) {
    const overflowed = inputs.length > show;
    const shownNames = inputs.slice(0, show).map((entry, i) => (
      <>
        {i > 0 ? ", " : ""}
        <strong>{toName(entry)}</strong>
      </>
    ));
    return (
      <>
        {shownNames}
        {overflowed ? ` and ${inputs.length - show} more` : ""}
      </>
    );
  }

  function renderFormNameBucket(bucket: PBSFormFilterBucketByFormName) {
    return (
      <>
        <strong>Form:</strong> {bucket.formName}
        <ul class="list-inside list-disc text-sm text-foreground-muted">
          <li>{renderNameList(view.bucket.entries, getEntrySpeciesName, 3)}.</li>
          <li>{renderKnown()}</li>
        </ul>
      </>
    );
  }

  function renderLineBucket(bucket: PBSFormFilterBucketByLine) {
    return (
      <>
        <strong>Forms of {bucket.speciesNames.length === 1 ? "Pokémon" : "Family"}:</strong>{" "}
        {bucket.speciesNames[0]}
        <ul class="list-inside list-disc text-sm text-foreground-muted">
          <li>{renderNameList(bucket.formNames, (s) => s, 2)}.</li>
          <li>{renderKnown()}</li>
        </ul>
      </>
    );
  }

  function getEntrySpeciesName({ resolutionInfo }: PBSFormFilterBucketEntry) {
    return resolutionInfo.kind === "unknown"
      ? resolutionInfo.speciesName
      : SPECIES.of(resolutionInfo.speciesKey).name;
  }

  return (
    <div class="relative rounded-md border-2 border-divider-heavy p-4">
      <div class="absolute -top-2.5 left-4 bg-background px-2 text-xs">
        {view.index + 1} / {view.total}
      </div>
      <Show when={view.index}>
        <div class="absolute -top-2.5 right-4 bg-background px-2 text-xs">
          <ButtonLink onClick={() => props.phase.forms.undoCustomChoice()}>Undo</ButtonLink>
        </div>
      </Show>
      <div>
        {view.bucket.groupedBy === "formName"
          ? renderFormNameBucket(view.bucket)
          : renderLineBucket(view.bucket)}
      </div>
      <div
        class="absolute -bottom-2.5 bg-background px-2 text-center whitespace-nowrap"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      >
        <ButtonLink onClick={() => props.phase.forms.pushCustomChoice("add")}>Add</ButtonLink>
        <span class="text-foreground-muted">{" / "}</span>
        <ButtonLink onClick={() => props.phase.forms.pushCustomChoice("replace")}>
          Replace Base
        </ButtonLink>
        <span class="text-foreground-muted">{" / "}</span>
        <ButtonLink onClick={() => props.phase.forms.pushCustomChoice("omit")} look="warning">
          Omit
        </ButtonLink>
      </div>
    </div>
  );
}

/* --------------------------------- Footers -------------------------------- */

export function ImportPBSModalFormsFooter(props: ImportPBSModalFormsProps) {
  return (
    <Show when={props.phase.files.parsed.forms.length > 0} fallback={<FooterNoForms {...props} />}>
      <FooterOnForms {...props} />
    </Show>
  );
}

function FooterOnForms(props: ImportPBSModalFormsProps) {
  const submittable = createMemo(() => {
    if (!props.phase.forms.granularity) return false;
    if (props.phase.forms.granularity !== "custom") return true;

    const finishedLength = props.phase.forms.customBuckets?.length ?? Infinity;
    return props.phase.forms.customChoices.length === finishedLength;
  });

  return (
    <>
      <div class="mb-2 flex flex-col justify-center">
        <Button onClick={() => props.state.gotoFinish()} disabled={!submittable()}>
          Continue
        </Button>
      </div>

      <div class="text-center text-sm text-foreground-muted">
        Or,{" "}
        <ButtonLink
          onClick={() => {
            batch(() => {
              props.phase.forms.setGranularity(undefined);
              props.state.gotoFinish();
            });
          }}
        >
          skip this option
        </ButtonLink>{" "}
        to only import base forms.
      </div>
    </>
  );
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
          // eslint-disable-next-line solid/reactivity
          onUpload={async (fileList) => {
            setUploading(true);
            await props.phase.files.import(fileList);
            setUploading(false);
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
