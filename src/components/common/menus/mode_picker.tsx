import { For } from "solid-js";
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

export function ModePicker(props: ModePickerProps) {
  return (
    <ul class="mb-4 last:mb-0">
      <For each={props.modes}>
        {(mode, index) => (
          <li class="border-b border-b-divider-light py-2 first:pt-0 last:border-b-0 last:pb-0">
            <label class="flex cursor-pointer items-center border-t border-t-divider-light first:border-t-0">
              <input class="hidden" type="radio" onClick={() => props.setActiveIndex(index())} />

              <div
                class="mr-4 opacity-20"
                classList={{ "text-primary opacity-100": index() === props.activeIndex }}
              >
                <Icon name={mode.icon} />
              </div>

              <div>
                <div>{mode.name}</div>
                {mode.description ? <div class="text-base">{mode.description}</div> : null}
              </div>
            </label>
          </li>
        )}
      </For>
    </ul>
  );
}
