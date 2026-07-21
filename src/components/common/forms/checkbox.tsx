import type { JSXElement } from "solid-js";
import { Icon } from "../icon";

export interface CheckboxProps {
  name: string;
  radio?: boolean;
  checked: boolean | undefined;
  onChange?(checked: boolean): void;
  onClick?(): void;
  children?: JSXElement;
}

export function Checkbox(props: CheckboxProps) {
  const icon = () => {
    return props.radio
      ? props.checked
        ? "circle-dot"
        : "circle"
      : props.checked
        ? "square-check"
        : "square";
  };
  return (
    <label
      class="flex w-fit cursor-pointer items-center select-none"
      onClick={() => props.onClick?.()}
    >
      <input
        class="hidden"
        type={props.radio ? "radio" : "checkbox"}
        checked={props.checked}
        onChange={(e) => props.onChange?.(e.target.checked)}
      />
      <div class="mr-1 text-primary" classList={{ "text-sm lg:text-base": props.radio }}>
        <Icon name={icon()} />
      </div>
      <div>{props.name}</div>
      {props.children}
    </label>
  );
}
