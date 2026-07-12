import type { ComponentChildren } from "preact";

const LOOKS = {
  primary: "text-primary",
  secondary: "text-secondary",
  none: "",
  warning: "text-warning",
};

interface SharedProps {
  look?: keyof typeof LOOKS;
  bold?: boolean;
  small?: boolean;
  children: ComponentChildren;
}

export interface LinkProps extends SharedProps {
  to: string;
  blank?: boolean;
}

export function Link(props: LinkProps) {
  return (
    <a class={toClassList(props)} href={props.to} target={props.blank ? "_blank" : undefined}>
      {props.children}
    </a>
  );
}

export interface ButtonLinkProps extends SharedProps {
  disabled?: boolean;
  onClick(): void;
}

export function ButtonLink(props: ButtonLinkProps) {
  return (
    <button class={toClassList(props)} onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </button>
  );
}

function toClassList({ look, bold, small }: SharedProps) {
  return `cursor-pointer underline ${LOOKS[look ?? "primary"]} ${bold ? `font-bold` : ""} ${small ? `text-sm` : ""}`;
}
