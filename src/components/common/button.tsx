import type { JSXElement } from "solid-js";
import { Icon } from "./icon";

const LOOKS = {
  primary: "bg-primary text-foreground-primary",
  // TODO: Figure out exact use of secondary.
  secondary: "bg-secondary text-foreground-secondary",
};

export interface ButtonProps {
  look?: keyof typeof LOOKS;
  children: JSXElement;
  onClick(): void;
}

export function Button(props: ButtonProps) {
  return (
    <button
      class={`cursor-pointer rounded-md px-4 py-2 ${LOOKS[props.look ?? "primary"]}`}
      onClick={() => props.onClick()}
    >
      {props.children}
    </button>
  );
}

const ICON_LOOKS = {
  lesser: "text-foreground-lesser",
};

export interface ButtonIconProps {
  icon: string;
  look?: keyof typeof ICON_LOOKS;
  label: string;
  onClick(): void;
}

export function ButtonIcon(props: ButtonIconProps) {
  return (
    <button
      class={`cursor-pointer ${ICON_LOOKS[props.look ?? "lesser"]}`}
      title={props.label}
      aria-label={props.label}
      onClick={() => props.onClick()}
    >
      <Icon name={props.icon} />
    </button>
  );
}
