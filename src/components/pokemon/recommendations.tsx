import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { RecommendedChange } from "../../metrics/recommendations";
import { REGIONS } from "../../models/region";
import type { RegionSet } from "../../models/region_set";
import { STRICTNESSES } from "../../models/strictness";
import { TYPES } from "../../models/type";
import { MetricsContext, RegionsContext, StrictnessContext } from "../../state/context";
import { stored } from "../../utils/storage";
import { ButtonLink } from "../common/button_link";
import { Icon } from "../common/icon";
import { ModePicker } from "../common/mode_picker";
import { LinedSubheading } from "../layout/lined_subheading";
import { Modal } from "../layout/modal";
import { TypeName } from "./util/type_name";

const store = stored<boolean>("stardex_recommendations_show_just_right");

export function Recommendations() {
  const regions = useContext(RegionsContext);
  const strictness = useContext(StrictnessContext);
  const showJustRight = useSignal(store.load() ?? false);

  const modal = useSignal<"regions" | "strictness">();

  useSignalEffect(() => {
    store.dump(showJustRight.value);
  });

  return (
    <>
      <ul class="mb-6 ml-4 list-inside list-disc">
        <ModalButton
          label="Regions"
          valueLabel={
            regions.isAll.value ? "All" : regions.isRecommended.value ? "Recommended" : "Customized"
          }
          onClick={() => (modal.value = "regions")}
        />

        <ModalButton
          label="Strictness"
          valueLabel={strictness.name.value}
          onClick={() => (modal.value = "strictness")}
        />
      </ul>

      <RecommendedChangeGroup change="remove" title="Too Many" />
      <RecommendedChangeGroup change="add" title="Too Few" />

      <Show when={showJustRight}>
        <RecommendedChangeGroup change="none" title="Just Right" />
      </Show>

      <ButtonLink onClick={() => (showJustRight.value = !showJustRight.value)} small>
        {showJustRight.value ? "Hide" : "Show"} just right
      </ButtonLink>

      {modal.value === "regions" ? (
        <Modal title="Regions" onClose={() => (modal.value = undefined)}>
          <RegionsPicker regions={regions} />
        </Modal>
      ) : null}

      {modal.value === "strictness" ? (
        <Modal title="Strictness" onClose={() => (modal.value = undefined)}>
          <ModePicker
            modes={STRICTNESSES.options}
            activeIndex={strictness.index.value}
            setActiveIndex={(index) => (strictness.key.value = STRICTNESSES.keys[index])}
          />
          <div class="text-sm">
            <strong>Tip:</strong> Strictness controls how much Stardex expects you to adhere to the
            type distributions in the regions you've chosen to compare against.
          </div>
        </Modal>
      ) : null}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Modal Button                                */
/* -------------------------------------------------------------------------- */

interface ModalButtonProps {
  label: string;
  valueLabel: string;
  onClick(): void;
}

function ModalButton(props: ModalButtonProps) {
  return (
    <li>
      <strong>
        {props.label}
        {": "}
      </strong>
      <ButtonLink onClick={props.onClick}>{props.valueLabel}</ButtonLink>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Recommended Change                             */
/* -------------------------------------------------------------------------- */

interface RecommendedChangeGroupProps {
  change: RecommendedChange;
  title: string;
}

function RecommendedChangeGroup({ change, title }: RecommendedChangeGroupProps) {
  const metrics = useContext(MetricsContext);
  const recommendations = useComputed(() =>
    metrics.recommendations.value.filter((r) => r.change === change),
  );

  if (recommendations.value.length === 0) {
    return null;
  }

  return (
    <div class="mb-4 last:mb-0">
      <LinedSubheading>{title}</LinedSubheading>
      {recommendations.value.map(({ type, ownRatio, againstRatio }) => (
        <li class="flex items-center p-2">
          <div class="mr-4 hidden w-11.25 text-4xl md:block" style={`color: ${type.color}`}>
            <Icon name={type.icon} />
          </div>

          <div class="grow">
            <h2 style={`color: ${type.color}`}>
              <span class="md:hidden">
                <Icon name={type.icon} />
              </span>
              {type.name}
            </h2>

            <div class="text-foreground-lesser text-base">
              {(ownRatio * 100).toFixed(2)}% — {(againstRatio * 100).toFixed(2)}% of compared.
            </div>
          </div>
        </li>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Regions Picker                               */
/* -------------------------------------------------------------------------- */

interface RegionsPickerProps {
  regions: RegionSet;
}

function RegionsPicker(props: RegionsPickerProps) {
  return (
    <>
      <div class="mb-4 grid grid-cols-2 gap-4">
        {REGIONS.all.map((region) => {
          const checked = props.regions.has(region);
          return (
            <label class="border-divider-light relative flex cursor-pointer rounded-xs border p-2 transition select-none hover:-translate-y-1">
              <input
                class="hidden"
                type="checkbox"
                checked={checked}
                onClick={(e) => {
                  if (e.currentTarget.checked) {
                    props.regions.add(region.key);
                  } else {
                    props.regions.delete(region.key);
                  }
                }}
              />

              {checked ? (
                <div class="absolute -top-2 -left-2 text-lime-600">
                  <Icon name="badge-check" />
                </div>
              ) : null}

              <div class="mr-2">
                <Icon name={region.icon} />
              </div>

              <div>{region.name}</div>
            </label>
          );
        })}
      </div>

      <div class="text-sm">
        <strong>Tip:</strong> Selected regions will be used as the basis of the recommendations
        list. The average distribution of types (for example, what percentage of Pokémon are{" "}
        <TypeName type={TYPES.of("fire")} /> type) will be used to inform recommendations.
      </div>
    </>
  );
}
