import type { ComponentChildren } from "preact";

export interface LinedSubheadingProps {
  children: ComponentChildren;
}

export function LinedSubheading(props: LinedSubheadingProps) {
  return (
    <h3 class="mb-4 flex items-center">
      <div class="border-b-divider-light w-4 border-b"></div>
      <div class="px-2 text-xl">{props.children}</div>
      <div class="border-b-divider-light grow border-b"></div>
    </h3>
  );
}
