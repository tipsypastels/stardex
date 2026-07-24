import type { JSXElement } from "solid-js";
import { tw } from "../../utils/style";
import { Icon } from "./icon";

const LOOKS = {
  primary: tw`bg-primary text-primary-foreground`,
  secondary: tw`bg-secondary text-secondary-foreground`,
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
  muted: tw`text-foreground-muted`,
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
      class={`cursor-pointer ${ICON_LOOKS[props.look ?? "muted"]}`}
      title={props.label}
      aria-label={props.label}
      onClick={() => props.onClick()}
    >
      <Icon name={props.icon} />
    </button>
  );
}
