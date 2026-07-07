import type { ComponentChildren } from "preact";

export interface ButtonLinkProps {
  children: ComponentChildren;
  onClick(): void;
  small?: boolean;
}

export function ButtonLink(props: ButtonLinkProps) {
  return (
    <button
      class={`text-primary cursor-pointer underline ${props.small ? `text-sm` : ""}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
