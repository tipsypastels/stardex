import {
  batch,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
  type JSXElement,
} from "solid-js";
import { Portal } from "solid-js/web";
import { Icon } from "../icon";

const root = document.getElementById("root-modal")!;

export interface DropdownProps {
  children: JSXElement;
  onClose(): void;
}

export function Dropdown(props: DropdownProps) {
  const [position, setPosition] = createSignal({ top: 0, right: 0 });

  let anchor!: HTMLDivElement;
  let panel: HTMLDivElement | undefined;

  function updatePosition() {
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setPosition({ top: rect.bottom, right: window.innerWidth - rect.right });
  }

  function handleClick(event: MouseEvent) {
    const node = event.target as Node;
    if (!anchor?.contains(node) && !panel?.contains(node)) {
      event.stopPropagation();
      props.onClose();
    }
  }

  createEffect(() => {
    updatePosition();

    document.body.addEventListener("click", handleClick, true);
    window.addEventListener("resize", updatePosition, true);
    window.addEventListener("scroll", updatePosition, true);

    onCleanup(() => {
      document.body.removeEventListener("click", handleClick, true);
      window.removeEventListener("resize", updatePosition, true);
      window.removeEventListener("scroll", updatePosition, true);
    });
  });

  return (
    // eslint-disable-next-line solid/reactivity
    <OnCloseContext.Provider value={props.onClose}>
      <div class="relative" ref={anchor}>
        <Portal mount={root}>
          <div
            ref={panel}
            class="fixed z-60 w-max rounded-md border-2 border-divider-light bg-background shadow-lg"
            style={{
              top: `${position().top}px`,
              right: `${position().right}px`,
            }}
          >
            <ul class="appearance-auto py-2">{props.children}</ul>
          </div>
        </Portal>
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

export interface DropdownTriggerProps {
  title: string;
  open: boolean;
  onClick(): void;
}

export function DropdownTrigger(props: DropdownTriggerProps) {
  return (
    <button
      class="cursor-pointer text-foreground-muted"
      classList={{ "text-primary!": props.open }}
      title={props.title}
      onClick={() => props.onClick()}
    >
      <Icon name="ellipsis" />
    </button>
  );
}

const OnCloseContext = createContext<() => void>();
