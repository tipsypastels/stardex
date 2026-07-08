import type { ComponentChildren } from "preact";

export interface EmptyProps {
  children: ComponentChildren;
}

export function Empty({ children }: EmptyProps) {
  return (
    <div class="border-secondary text-secondary flex items-center justify-center rounded-md border-2 border-dashed p-4">
      <div>{children}</div>
    </div>
  );
}
