import { For, Show } from "solid-js";
import type { Recommendation } from "../../metrics/recommendations";
import { globalInterfaceOptions } from "../../models/interface";
import { recommendations } from "../../models/metrics";
import { ButtonIcon } from "../common/button";
import { Icon } from "../common/icon";

export function PipRecommendations() {
  function change(recommendations: Recommendation[], label: string) {
    return (
      <Show when={recommendations.length > 0}>
        <div>
          <strong>{label}</strong>
          <ul class="grid grid-cols-6 gap-x-1 dim md:grid-cols-8">
            <For each={recommendations}>
              {(recommendation) => (
                <li style={{ color: recommendation.type.color }} title={recommendation.type.name}>
                  <Icon name={recommendation.type.icon} />
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
    );
  }

  return (
    <div class="fixed right-8 bottom-8 z-40 rounded-lg border-2 border-divider-heavy bg-background shadow-shadow">
      <div class="absolute top-4 right-4">
        <ButtonIcon
          icon="times"
          label="Close"
          onClick={() => (globalInterfaceOptions.pipRecommendations = false)}
        />
      </div>
      <div class="p-4">
        {change(recommendations.value.remove, "Too Many")}
        {change(recommendations.value.add, "Too Few")}
        {change(recommendations.value.none, "Just Right")}
      </div>
    </div>
  );
}
