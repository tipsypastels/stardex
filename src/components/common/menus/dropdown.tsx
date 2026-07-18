import {
  batch,
  createContext,
  createEffect,
  onCleanup,
  useContext,
  type JSXElement,
} from "solid-js";
import { Icon } from "../icon";

export interface DropdownProps {
  children: JSXElement;
  onClose(): void;
}

export function Dropdown(props: DropdownProps) {
  let ref!: HTMLDivElement;

  function handleClick(event: MouseEvent) {
    if (!ref?.contains(event.target as Node)) {
      props.onClose();
    }
  }

  createEffect(() => {
    document.body.addEventListener("click", handleClick, true);
    onCleanup(() => document.body.removeEventListener("click", handleClick, true));
  });

  return (
    // eslint-disable-next-line solid/reactivity
    <OnCloseContext.Provider value={props.onClose}>
      <div class="relative" ref={ref}>
        <div class="absolute -top-4 right-0 z-60 w-max border-2 border-divider-light bg-background shadow-lg">
          <ul class="appearance-auto py-2">{props.children}</ul>
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

export function DropdownItem(props: DropdownItemProps) {
  const onClose = useContext(OnCloseContext);
  return (
    <li>
      <button
        class="cursor-pointer px-4 py-1 hover:text-primary"
        onClick={() => {
          batch(() => {
            props.onClick();
            onClose?.();
          });
        }}
      >
        <Icon name={props.icon} class="pr-1" />
        {props.name}
      </button>
    </li>
  );
}

export function DropdownDivider() {
  return <li class="mb-2 border-b-2 border-b-divider-light pb-2" />;
}

const OnCloseContext = createContext<() => void>();
