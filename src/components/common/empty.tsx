import type { JSXElement } from "solid-js";

export interface EmptyProps {
  class?: string;
  children: JSXElement;
}

export function Empty(props: EmptyProps) {
  return (
    <div
      class={`flex items-center justify-center rounded-md border-2 border-dashed border-secondary p-4 text-secondary ${props.class ?? ""}`}
    >
      <div>{props.children}</div>
    </div>
  );
}
