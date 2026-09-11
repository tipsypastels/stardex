import { For } from "solid-js";
import type { Recommendation } from "../../metrics/recommendations";
import { recommendations } from "../../models/metrics";
import { ButtonIcon } from "../common/button";
import { Icon } from "../common/icon";

export interface PipRecommendationsProps {
  onClose(): void;
}

export function PipRecommendations(props: PipRecommendationsProps) {
  function change(recommendations: Recommendation[], label: string) {
    return (
      <div>
        <strong>{label}</strong>
        <ul class="flex dim">
          <For each={recommendations}>
            {(recommendation) => (
              <li
                class="pr-1"
                style={{ color: recommendation.type.color }}
                title={recommendation.type.name}
              >
                <Icon name={recommendation.type.icon} />
              </li>
            )}
          </For>
        </ul>
      </div>
    );
  }

  return (
    <div class="fixed right-8 bottom-8 z-40 rounded-lg border-2 border-divider-heavy bg-background shadow-shadow">
      <div class="absolute top-4 right-4">
        <ButtonIcon icon="times" label="Close" onClick={() => props.onClose()} />
      </div>
      <div class="p-4">
        {change(recommendations.value.remove, "Too Many")}
        {change(recommendations.value.add, "Too Few")}
        {change(recommendations.value.none, "Just Right")}
      </div>
    </div>
  );
}
