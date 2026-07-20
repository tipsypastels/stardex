import { Show } from "solid-js";
import { Icon } from "../icon";

export interface CheckboxProps {
  name: string;
  checked: boolean | undefined;
  onChange(checked: boolean): void;
}

export function Checkbox(props: CheckboxProps) {
  return (
    <label class="flex cursor-pointer items-center select-none">
      <input
        class="hidden"
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
      />
      <div class="mr-1 text-primary">
        <Show when={props.checked} fallback={<Icon name="square" />}>
          <Icon name="square-check" />
        </Show>
      </div>
      <div>{props.name}</div>
    </label>
  );
}
