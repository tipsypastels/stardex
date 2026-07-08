import { Icon } from "./icon";

export interface LoadingProps {
  height: number;
}

export function Loading({ height }: LoadingProps) {
  return (
    <div
      class="border-secondary text-secondary flex items-center justify-center rounded-md border-2 border-dashed p-4 text-2xl"
      style={`height: ${height}px`}
      aria-label="Loading..."
    >
      <Icon name="loader" class="fa-spin" />
    </div>
  );
}
