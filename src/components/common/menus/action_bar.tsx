import type { ComponentChildren, Signalish } from "preact";
import { forwardRef, type ForwardedRef } from "preact/compat";
import { Icon } from "../icon";

export interface ActionBarProps {
  children: ComponentChildren;
  isUpperHalf?: boolean;
}

export function ActionBar({ children, isUpperHalf }: ActionBarProps) {
  return (
    <ul
      class="mb-8 flex scrollbar-none overflow-x-scroll rounded-md border-2 border-secondary text-secondary data-upper-half:rounded-b-none data-[upper-half=true]:mb-0"
      data-upper-half={isUpperHalf}
    >
      {children}
    </ul>
  );
}

export interface ActionBarItemProps {
  name: string;
  icon: string;
  active?: Signalish<boolean>;
  disabled?: Signalish<boolean>;
  onClick(): void;
}

export const ActionBarItem = forwardRef(
  (
    { name, icon, active, disabled, onClick }: ActionBarItemProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <li class="border-r border-r-secondary last:max-sm:border-r-0">
        <button
          ref={ref}
          class="flex cursor-pointer items-center justify-center gap-1 px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70 data-[active=true]:text-primary"
          data-active={active}
          disabled={disabled}
          onClick={onClick}
        >
          <div class="text-xs">
            <Icon name={icon} />
          </div>
          {name}
        </button>
      </li>
    );
  },
);
