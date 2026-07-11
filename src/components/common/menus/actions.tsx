import type { Signalish } from "preact";
import { Icon } from "../icon";

export interface ActionsAction {
  name: string;
  icon: string;
  active?: boolean;
  disabled?: Signalish<boolean>;
  desktop?: boolean;
  onClick(): void;
}

export interface ActionsProps {
  actions: ActionsAction[];
  isUpperHalf?: boolean;
}

export function Actions({ actions, isUpperHalf = false }: ActionsProps) {
  return (
    <ul
      class={`"border-secondary flex border-2 text-secondary ${isUpperHalf ? "rounded-t-md" : "mb-8 rounded-md"}`}
    >
      {actions.map((action) => (
        <li class={`border-r border-r-secondary ${action.desktop ? "hidden lg:block" : ""}`}>
          <button
            class={`flex cursor-pointer items-center gap-1 px-4 py-2 text-sm font-bold ${action.active ? "text-primary" : ""} disabled:cursor-not-allowed disabled:opacity-70`}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            <div class="text-xs">
              <Icon name={action.icon} />
            </div>
            <div>{action.name}</div>
          </button>
        </li>
      ))}
    </ul>
  );
}
