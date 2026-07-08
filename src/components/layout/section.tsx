import type { ComponentChildren } from "preact";

export interface SectionProps {
  id: string;
  title: string;
  children: ComponentChildren;
  hasActions?: boolean;
}

export function Section({ id, title, children, hasActions }: SectionProps) {
  return (
    <section id={id} class="border-b-divider-light relative mb-8 border-b pb-8">
      <h2 class={`grow text-3xl ${hasActions ? "mb-2" : "mb-8"}`}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
