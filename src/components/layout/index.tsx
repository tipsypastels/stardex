import type { ComponentChildren } from "preact";

export interface LayoutProps {
  left: ComponentChildren;
  right: ComponentChildren;
}

export function Layout(props: LayoutProps) {
  return (
    <main class="mx-4 flex min-h-screen flex-col xl:mx-0">
      <header class="p-4">
        <div
          title="Stardex"
          class="bg-primary flex h-13.75 w-13.75 items-center justify-center rounded-md text-3xl font-bold text-white shadow-xl shadow-slate-400 select-none"
        >
          <div>Sd</div>
        </div>
      </header>
      <div class="xl:flex xl:grow xl:justify-center xl:gap-4">
        <Pane>{props.left}</Pane>
        <div class="xl:border-l-divider-light xl:border-l"></div>
        <Pane>{props.right}</Pane>
      </div>
    </main>
  );
}

function Pane(props: { children: ComponentChildren }) {
  return <div class="xl:max-w-200 xl:grow xl:p-4">{props.children}</div>;
}
