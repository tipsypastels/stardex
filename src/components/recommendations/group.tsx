import { For, Show } from "solid-js";
import type { Recommendation } from "../../metrics/recommendations";
import { LinedSubheading } from "../common/heading";
import { Icon } from "../common/icon";

export interface RecommendedChangeGroupProps {
  recommendations: Recommendation[];
  title: string;
}

export function RecommendedChangeGroup(props: RecommendedChangeGroupProps) {
  return (
    <Show when={props.recommendations.length > 0}>
      <div class="mb-4 last:mb-0">
        <LinedSubheading>{props.title}</LinedSubheading>
        <For each={props.recommendations}>
          {({ type, ownRatio, againstRatio }) => (
            <li class="flex items-center p-2">
              <div class="mr-4 hidden w-11.25 text-4xl dim md:block" style={{ color: type.color }}>
                <Icon name={type.icon} />
              </div>

              <div class="grow">
                <h2 class="dim" style={{ color: type.color }}>
                  <span class="mr-1 md:hidden">
                    <Icon name={type.icon} />
                  </span>
                  {type.name}
                </h2>

                <div class="text-base text-foreground-muted">
                  {(ownRatio * 100).toFixed(2)}% — {(againstRatio * 100).toFixed(2)}% of compared.
                </div>
              </div>
            </li>
          )}
        </For>
      </div>
    </Show>
  );
}
