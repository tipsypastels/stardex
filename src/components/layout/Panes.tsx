import type { ComponentChildren } from "preact";

export interface PanesProps {
  left: ComponentChildren;
  right: ComponentChildren;
}

export function Panes(props: PanesProps) {
  return (
    <div class="lg:flex">
      <Pane>{props.left}</Pane>
      <Pane>{props.right}</Pane>
    </div>
  );
}

function Pane(props: { children: ComponentChildren }) {
  return <div class="lg:grow lg:p-4">{props.children}</div>;
}
