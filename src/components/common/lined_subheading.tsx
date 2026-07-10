import type { ComponentChildren } from "preact";

export interface LinedSubheadingProps {
  children: ComponentChildren;
}

export function LinedSubheading(props: LinedSubheadingProps) {
  return (
    <h3 class="mb-4 flex items-center">
      <div class="w-4 border-b border-b-divider-light"></div>
      <div class="px-2 text-xl">{props.children}</div>
      <div class="grow border-b border-b-divider-light"></div>
    </h3>
  );
}
