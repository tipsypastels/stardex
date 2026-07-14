import { batch } from "@preact/signals";
import { createContext, type ComponentChildren } from "preact";
import { useContext, useEffect, useRef } from "preact/hooks";
import { Icon } from "../icon";

export interface DropdownProps {
  children: ComponentChildren;
  onClose(): void;
}

export function Dropdown({ children, onClose }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleClick(event: MouseEvent) {
    if (!ref.current?.contains(event.target as HTMLElement)) {
      onClose();
    }
  }

  useEffect(() => {
    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  });

  return (
    <OnCloseContext.Provider value={onClose}>
      <div class="relative" ref={ref}>
        <div class="absolute -top-4 right-0 z-60 w-max border-2 border-divider-light bg-background shadow-lg">
          <ul class="appearance-auto py-2">{children}</ul>
        </div>
      </div>
    </OnCloseContext.Provider>
  );
}

export interface DropdownItemProps {
  name: string;
  icon: string;
  onClick(): void;
}

export function DropdownItem({ name, icon, onClick }: DropdownItemProps) {
  const onClose = useContext(OnCloseContext);
  return (
    <li>
      <button
        class="cursor-pointer px-4 py-1 hover:text-primary"
        onClick={() => {
          batch(() => {
            onClick();
            onClose?.();
          });
        }}
      >
        <Icon name={icon} class="pr-1" />
        {name}
      </button>
    </li>
  );
}

export function DropdownDivider() {
  return <li class="mb-2 border-b-2 border-b-divider-light pb-2" />;
}

const OnCloseContext = createContext<(() => void) | undefined>(undefined);
