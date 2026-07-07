import type { ComponentChildren } from "preact";

export interface LayoutProps {
  left: ComponentChildren;
  right: ComponentChildren;
}

export function Layout(props: LayoutProps) {
  return (
    <div class="flex min-h-screen flex-col">
      <header class="p-4">
        <div
          title="Stardex"
          class="bg-primary flex h-13.75 w-13.75 items-center justify-center rounded-md text-3xl font-bold text-white shadow-xl shadow-slate-400 select-none"
        >
          <div>Sd</div>
        </div>
      </header>
      <div class="lg:flex">
        <Pane>{props.left}</Pane>
        <Pane>{props.right}</Pane>
      </div>
    </div>
  );
}

function Pane(props: { children: ComponentChildren }) {
  return <div class="lg:grow lg:p-4">{props.children}</div>;
}
