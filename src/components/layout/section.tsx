import type { ComponentChildren } from "preact";

export interface SectionProps {
  title: string;
  children: ComponentChildren;
  left?: boolean;
}

export function Section(props: SectionProps) {
  return (
    <section
      class={`border-b-divider-light relative mb-8 border-b pb-8 ${props.left ? `xl:last:mb-0 xl:last:border-b-0` : `last:mb-0 last:border-b-0`}`}
    >
      <h2 class="mb-8 grow text-3xl">{props.title}</h2>
      <div>{props.children}</div>
    </section>
  );
}
