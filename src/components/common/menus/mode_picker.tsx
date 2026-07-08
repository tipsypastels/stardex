import { Icon } from "../icon";

interface Mode {
  name: string;
  description?: string;
}

export interface ModePickerProps {
  modes: Mode[];
  activeIndex: number | undefined;
  setActiveIndex(index: number): void;
}

export function ModePicker(props: ModePickerProps) {
  return (
    <div>
      {props.modes.map((mode, index) => {
        const active = index === props.activeIndex;
        return (
          <label class="border-t-divider-light flex cursor-pointer items-center border-t p-4 first:border-t-0">
            <input
              class="hidden"
              type="radio"
              name="strictness"
              onClick={() => props.setActiveIndex(index)}
            />

            <div class={`text-primary mr-4 ${active ? "" : "opacity-0"}`}>
              <Icon name="badge-check" />
            </div>

            <div>
              <div>{mode.name}</div>
              {mode.description ? <div class="text-base">{mode.description}</div> : null}
            </div>
          </label>
        );
      })}
    </div>
  );
}
