import type { ComponentChildren } from "preact";

export interface PanesProps {
  left: ComponentChildren;
  right: ComponentChildren;
}

export function Panes(props: PanesProps) {
  return (
    <div class="Panes">
      <div class="Panes__pane">{props.left}</div>
      <div class="Panes__pane">{props.right}</div>
    </div>
  );
}
