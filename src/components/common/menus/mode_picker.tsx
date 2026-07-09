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
      {props.modes.map((mode, index) => {
        const active = index === props.activeIndex;
        return (
          <li class="border-b-divider-light border-b py-2 first:pt-0 last:border-b-0 last:pb-0">
            <label class="border-t-divider-light flex cursor-pointer items-center border-t first:border-t-0">
              <input
                class="hidden"
                type="radio"
                name="strictness"
                onClick={() => props.setActiveIndex(index)}
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
      })}
    </ul>
  );
}
