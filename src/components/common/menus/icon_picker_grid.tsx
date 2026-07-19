import type { JSXElement } from "solid-js";
import { Icon } from "../icon";

export interface IconPickerGridProps {
  children: JSXElement;
}

export function IconPickerGrid(props: IconPickerGridProps) {
  return <ul class="mb-4 grid grid-cols-4 gap-4 last:mb-0 md:grid-cols-6">{props.children}</ul>;
}

export interface IconPickerGridItemProps {
  name: string;
  icon: string;
  iconColor?: string;
  count?: number;
  active: boolean;
  onClick(): void;
}

export function IconPickerGridItem(props: IconPickerGridItemProps) {
  return (
    <li class="group relative flex justify-center" classList={{ "opacity-50": !props.active }}>
      <button
        class="flex cursor-pointer justify-center select-none"
        onClick={() => props.onClick()}
      >
        <div class="flex flex-col items-center">
          <div class="text-3xl dim" style={{ color: props.iconColor }}>
            <Icon name={props.icon} />
          </div>
          <div>{props.name}</div>
        </div>
        {props.count ? <sub class="text-foreground-lesser">{props.count}</sub> : null}
      </button>
    </li>
  );
}
