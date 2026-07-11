import { For } from "@preact/signals/utils";
import { Icon } from "../icon";

interface Mode {
  name: string;
  icon: string;
  description?: string;
}

export interface ModePickerProps {
  modes: Mode[];
  activeIndex: number | undefined;
  setActiveIndex(index: number): void;
}

export function ModePicker({ modes, activeIndex, setActiveIndex }: ModePickerProps) {
  return (
    <ul class="mb-4 last:mb-0">
      <For each={() => modes} getKey={(mode) => mode.name}>
        {(mode, index) => {
          const active = index === activeIndex;
          return (
            <li class="border-b border-b-divider-light py-2 first:pt-0 last:border-b-0 last:pb-0">
              <label class="flex cursor-pointer items-center border-t border-t-divider-light first:border-t-0">
                <input
                  class="hidden"
                  type="radio"
                  name="strictness"
                  onClick={() => setActiveIndex(index)}
                />

                <div class={`mr-4 ${active ? "text-primary" : "opacity-20"}`}>
                  <Icon name={mode.icon} />
                </div>

                <div>
                  <div>{mode.name}</div>
                  {mode.description ? <div class="text-base">{mode.description}</div> : null}
                </div>
              </label>
            </li>
          );
        }}
      </For>
    </ul>
  );
}
