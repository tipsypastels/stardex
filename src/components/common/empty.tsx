import type { JSXElement } from "solid-js";

export interface EmptyProps {
  class?: string;
  height?: number;
  children: JSXElement;
}

export function Empty(props: EmptyProps) {
  return (
    <div
      class={`flex items-center justify-center rounded-md border-2 border-dashed border-secondary p-4 text-secondary ${props.class ?? ""}`}
      style={{ height: props.height ? `${props.height}px` : undefined }}
    >
      <div>{props.children}</div>
    </div>
  );
}
