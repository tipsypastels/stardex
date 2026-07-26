import { For, Match, Show, Switch } from "solid-js";
import { Icon } from "./icon";

export interface StepsProps {
  currentIndex: number;
  steps: { label: string }[];
}

export function Steps(props: StepsProps) {
  return (
    <div
      class="grid items-center gap-x-2 gap-y-1"
      style={{
        "grid-template-columns": props.steps
          .map((_, i) => `${i > 0 ? "1fr" : ""} min-content`)
          .join(" "),
      }}
    >
      <For each={props.steps}>
        {(_, i) => (
          <>
            <Show when={i() > 0}>
              <div
                class="rounded-full border-y-2 border-secondary"
                classList={{ "border-primary!": i() <= props.currentIndex }}
              />
            </Show>
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full border-4 border-secondary text-primary"
              classList={{
                "bg-primary text-primary-foreground!": i() < props.currentIndex,
                "border-primary!": i() <= props.currentIndex,
              }}
            >
              <Switch>
                <Match when={i() < props.currentIndex}>
                  <Icon name="check" />
                </Match>
                <Match when={i() === props.currentIndex}>
                  <Icon name="ellipsis" />
                </Match>
              </Switch>
            </div>
          </>
        )}
      </For>

      <For each={props.steps}>
        {(step, i) => (
          <>
            <Show when={i() > 0}>
              <div />
            </Show>
            <div class="text-center text-sm text-foreground-muted">{step.label}</div>
          </>
        )}
      </For>
    </div>
  );
}
