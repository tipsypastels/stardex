import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { RecommendedChange } from "../../metrics/recommendations";
import { REGIONS } from "../../models/region";
import type { RegionSet } from "../../models/region_set";
import { STRICTNESSES } from "../../models/strictness";
import { TYPES } from "../../models/type";
import {
  MetricsContext,
  PokemonsContext,
  RegionsContext,
  StrictnessContext,
} from "../../state/context";
import { stored } from "../../utils/storage";
import { Empty } from "../common/empty";
import { Icon } from "../common/icon";
import { ButtonLink } from "../common/link";
import { Actions } from "../common/menus/actions";
import { Modal } from "../common/menus/modal";
import { ModePicker } from "../common/menus/mode_picker";
import { LinedSubheading } from "../layout/lined_subheading";
import { Section } from "../layout/section";
import { TypeName } from "../types/util/name";

const store = stored<boolean>("stardex_recommendations_show_just_right");

export function Recommendations() {
  const pokemons = useContext(PokemonsContext);
  const regions = useContext(RegionsContext);
  const strictness = useContext(StrictnessContext);
  const showJustRight = useSignal(store.load() ?? false);

  const modal = useSignal<"regions" | "strictness">();

  useSignalEffect(() => {
    store.dump(showJustRight.value);
  });

  function regionsIcon() {
    if (regions.isAll.value) return "asterisk";
    if (regions.isRecommended.value) return "check";

    const count = regions.size.value;
    if (count === 0) return "times";
    if (count === 1) return regions.all.value[0].icon;
    return `${count}`;
  }

  function emptyFallbacks() {
    return (
      <Show
        when={() => pokemons.size.value === 0}
        fallback={
          <Empty>
            <strong>No regions are selected!</strong>{" "}
            <ButtonLink onClick={() => (modal.value = "regions")} look="none" bold>
              Select some
            </ButtonLink>{" "}
            to get recommendations.
          </Empty>
        }
      >
        <Empty>You still have no Pokémon yet.</Empty>
      </Show>
    );
  }

  return (
    <Section id="recommendations" title="Recommendations" hasActions>
      <Actions
        actions={[
          {
            name: "Regions",
            icon: regionsIcon(),
            onClick: () => (modal.value = "regions"),
          },
          {
            name: "Strictness",
            icon: strictness.icon.value,
            onClick: () => (modal.value = "strictness"),
          },
        ]}
      />

      <Show
        when={() => pokemons.size.value > 0 && regions.size.value > 0}
        fallback={emptyFallbacks()}
      >
        <RecommendedChangeGroup change="remove" title="Too Many" />
        <RecommendedChangeGroup change="add" title="Too Few" />

        <Show when={showJustRight}>
          <RecommendedChangeGroup change="none" title="Just Right" />
        </Show>

        <ButtonLink onClick={() => (showJustRight.value = !showJustRight.value)} small>
          {showJustRight.value ? "Hide" : "Show"} just right
        </ButtonLink>
      </Show>

      <Show when={() => modal.value === "regions"}>
        <Modal title="Regions" onClose={() => (modal.value = undefined)}>
          <RegionsPicker regions={regions} />
        </Modal>
      </Show>

      <Show when={() => modal.value === "strictness"}>
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
      </Show>
    </Section>
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
          <div class="dim mr-4 hidden w-11.25 text-4xl md:block" style={`color: ${type.color}`}>
            <Icon name={type.icon} />
          </div>

          <div class="grow">
            <h2 class="dim" style={`color: ${type.color}`}>
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

function RegionsPicker({ regions }: RegionsPickerProps) {
  return (
    <>
      <div class="mb-4 grid grid-cols-2 gap-4">
        {REGIONS.all.map((region) => {
          const checked = regions.has(region);
          return (
            <label class="border-divider-light relative flex cursor-pointer rounded-xs border p-2 transition select-none hover:-translate-y-1">
              <input
                class="hidden"
                type="checkbox"
                checked={checked}
                onClick={(e) => {
                  if (e.currentTarget.checked) {
                    regions.add(region.key);
                  } else {
                    regions.delete(region.key);
                  }
                }}
              />

              {checked ? (
                <div class="text-primary absolute -top-2 -left-2">
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

      <div class="mb-4">
        <strong>Select: </strong>
        <ButtonLink onClick={() => regions.set(REGIONS.recommendedKeys)}>Recommended</ButtonLink>
        {" / "}
        <ButtonLink onClick={() => regions.set(REGIONS.allKeys)}>All</ButtonLink>
        {" / "}
        <ButtonLink onClick={() => regions.set([])}>None</ButtonLink>
      </div>

      <div class="text-sm">
        <strong>Tip:</strong> Selected regions will be used as the basis of the recommendations
        list. The average distribution of types (for example, what percentage of Pokémon are{" "}
        <TypeName type={TYPES.of("fire")} /> type) will be used to inform recommendations.
      </div>

      <Show when={() => regions.hasKey("kanto")}>
        <div class="mt-2 text-sm">
          <strong class="text-warning">Warning:</strong> Kanto has a skewed type balance by the
          standards of later regions - for example, too many <TypeName type={TYPES.of("poison")} />{" "}
          types. You may find that you get better results if you{" "}
          <ButtonLink onClick={() => regions.delete("kanto")}>exclude it</ButtonLink>.
        </div>
      </Show>
    </>
  );
}
