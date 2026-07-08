import { useSignal, useSignalEffect } from "@preact/signals";
import type { ComponentChildren } from "preact";
import { useRef } from "preact/hooks";
import { Icon } from "./icon";

interface ButtonItem {
  type: "button";
  name: string;
  icon: string;
  class?: string;
  onClick(): void;
  keepOpenOnClick?: boolean;
}

interface DividerItem {
  type: "divider";
}

type Item = ButtonItem | DividerItem;

export interface MenuProps {
  items: Item[];
  trigger(toggle: () => void): ComponentChildren;
}

export function Menu(props: MenuProps) {
  const open = useSignal(false);
  const menu = useRef<HTMLDivElement>(null);

  function handleClick(e: MouseEvent) {
    if (!open) return;
    // May be null if hot reload weirdness etc.
    if (menu.current?.contains(e.target as HTMLElement)) return;
    open.value = false;
  }

  useSignalEffect(() => {
    if (open.value) {
      document.body.addEventListener("click", handleClick);
    } else {
      document.body.removeEventListener("click", handleClick);
    }
  });

  return (
    <div class="relative" ref={menu}>
      {props.trigger(() => (open.value = !open.value))}

      {open.value ? (
        <div class="border-divider-light bg-background absolute right-0 z-40 w-max border-2 shadow-lg">
          <ul class="appearance-none py-2">
            {props.items.map((item) =>
              item.type === "button" ? (
                <li>
                  <button
                    class="{item.class} hover:text-primary cursor-pointer px-4 py-1"
                    onClick={() => {
                      item.onClick();
                      if (!item.keepOpenOnClick) {
                        open.value = false;
                      }
                    }}
                  >
                    <Icon name={item.icon} class="pr-1" />
                    {item.name}
                  </button>
                </li>
              ) : item.type === "divider" ? (
                <li class="py-2">
                  <hr />
                </li>
              ) : null,
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
