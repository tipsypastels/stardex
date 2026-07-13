import { For } from "@preact/signals/utils";
import type { Signalish } from "preact";
import { tw } from "../../../utils/style";
import { Icon } from "../icon";

export const LOOKS = {
  primaryIfActive: (active: boolean) => tw`${active ? "text-primary" : ""}`,
  footer: () => tw`bg-footer`,
};

export interface ActionsAction {
  name: string;
  icon: string;
  active?: boolean;
  disabled?: Signalish<boolean>;
  desktop?: boolean;
  look?: keyof typeof LOOKS;
  onClick(): void;
}

export interface ActionsProps {
  actions: ActionsAction[];
  rightAction?: ActionsAction;
  isUpperHalf?: boolean;
}

export function Actions({ actions, rightAction, isUpperHalf = false }: ActionsProps) {
  function renderAction(action: ActionsAction, isRightAction = false) {
    return (
      <li
        class={`${isRightAction ? "grow border-l border-l-secondary lg:grow-0" : "border-r border-r-secondary"} ${action.desktop ? "hidden lg:block" : ""}`}
      >
        <button
          class={`flex w-full cursor-pointer items-center justify-center gap-1 px-4 py-2 text-sm font-bold ${LOOKS[action.look ?? "primaryIfActive"](action.active ?? false)} disabled:cursor-not-allowed disabled:opacity-70`}
          onClick={action.onClick}
          disabled={action.disabled}
        >
          <div class="text-xs">
            <Icon name={action.icon} />
          </div>
          <div>{action.name}</div>
        </button>
      </li>
    );
  }
  return (
    <ul
      class={`"border-secondary flex border-2 text-secondary ${isUpperHalf ? "rounded-t-md" : "mb-8 rounded-md"}`}
    >
      <For each={() => actions} getKey={(action) => action.name}>
        {(action) => renderAction(action)}
      </For>

      {rightAction ? (
        <>
          <li class="hidden grow lg:block"></li>
          {renderAction(rightAction, true)}
        </>
      ) : null}
    </ul>
  );
}
