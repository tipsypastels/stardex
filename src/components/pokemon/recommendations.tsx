import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { RecommendedChange } from "../../metrics/recommendations";
import { MetricsContext } from "../../state/context";
import { stored } from "../../utils/storage";
import { ButtonLink } from "../common/button_link";
import { Icon } from "../common/icon";
import { LinedSubheading } from "../layout/lined_subheading";

const store = stored<boolean>("stardex_recommendations_show_just_right");

export function Recommendations() {
  const showJustRight = useSignal(store.load() ?? false);

  useSignalEffect(() => {
    store.dump(showJustRight.value);
  });

  return (
    <>
      <RecommendedChangeGroup change="remove" title="Too Many" />
      <RecommendedChangeGroup change="add" title="Too Few" />

      <Show when={showJustRight}>
        <RecommendedChangeGroup change="none" title="Just Right" />
      </Show>

      <ButtonLink onClick={() => (showJustRight.value = !showJustRight.value)} small>
        {showJustRight.value ? "Hide" : "Show"} just right
      </ButtonLink>
    </>
  );
}

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
