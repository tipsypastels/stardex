import type { JSXElement, Ref } from "solid-js";
import { Icon } from "../icon";

export interface ActionBarProps {
  children: JSXElement;
  isUpperHalf?: boolean;
}

export function ActionBar(props: ActionBarProps) {
  return (
    <ul
      class="mb-8 flex scrollbar-none overflow-x-scroll rounded-md border-2 border-secondary text-secondary"
      classList={{ "mb-0! rounded-b-none": props.isUpperHalf }}
    >
      {props.children}
    </ul>
  );
}

export interface ActionBarItemProps {
  ref?: Ref<HTMLButtonElement>;
  id?: string;
  name: string;
  icon: string;
  active?: boolean;
  disabled?: boolean;
  onClick(): void;
}

export function ActionBarItem(props: ActionBarItemProps) {
  return (
    <li class="border-r-2 border-r-secondary last:max-sm:border-r-0">
      <button
        ref={props.ref}
        id={props.id}
        class="flex cursor-pointer items-center justify-center gap-1 px-4 py-2 text-sm font-bold"
        classList={{
          "cursor-not-allowed opacity-70": props.disabled,
          "text-primary": props.active,
        }}
        disabled={props.disabled}
        onClick={() => props.onClick()}
      >
        <div class="text-xs">
          <Icon name={props.icon} />
        </div>
        {props.name}
      </button>
    </li>
  );
}
