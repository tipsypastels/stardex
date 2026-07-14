import type { ComponentChildren, Signalish } from "preact";
import { Icon } from "../icon";

export interface IconPickerGridProps {
  children: ComponentChildren;
}

export function IconPickerGrid({ children }: IconPickerGridProps) {
  return <ul class="mb-4 grid grid-cols-4 gap-4 last:mb-0 md:grid-cols-6">{children}</ul>;
}

export interface IconPickerGridItemProps {
  name: string;
  icon: string;
  iconColor?: string;
  count?: number;
  active: Signalish<boolean>;
  onClick(): void;
}

export function IconPickerGridItem({
  name,
  icon,
  iconColor,
  count,
  active,
  onClick,
}: IconPickerGridItemProps) {
  return (
    <li
      class="group relative flex justify-center data-[active=false]:opacity-50"
      data-active={active}
    >
      <button class="flex cursor-pointer justify-center select-none" onClick={onClick}>
        <div class="flex flex-col items-center">
          <div class="text-3xl dim" style={`color: ${iconColor}`}>
            <Icon name={icon} />
          </div>
          <div>{name}</div>
        </div>
        {count ? <sub class="text-foreground-lesser">{count}</sub> : null}
      </button>
    </li>
  );
}
