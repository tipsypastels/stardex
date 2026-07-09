import { useComputed } from "@preact/signals";
import { useContext } from "preact/hooks";
import type { RecommendedChange } from "../../metrics/recommendations";
import { MetricsContext } from "../../state/context";
import { Icon } from "../common/icon";
import { LinedSubheading } from "../common/lined_subheading";

export interface RecommendedChangeGroupProps {
  change: RecommendedChange;
  title: string;
}

export function RecommendedChangeGroup({ change, title }: RecommendedChangeGroupProps) {
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
