import hotkeys from "hotkeys-js";
import type { ComponentChildren } from "preact";
import { createPortal } from "preact/compat";
import { useEffect } from "preact/hooks";
import { ButtonIcon } from "../button_icon";

const root = document.getElementById("app-modal")!;

export interface ModalProps {
  title: ComponentChildren;
  children: ComponentChildren;
  footer?: ComponentChildren;
  onClose(): void;
}

export function Modal(props: ModalProps) {
  function handleClick(e: MouseEvent) {
    if ((e.target as HTMLElement)?.parentNode === root) {
      props.onClose();
    }
  }

  useEffect(() => {
    hotkeys("esc", props.onClose);
    return () => hotkeys.unbind("esc");
  }, [props.onClose]);

  useEffect(() => {
    document.documentElement.classList.add("has-modal");
    return () => document.documentElement.classList.remove("has-modal");
  });

  return createPortal(
    <div
      class="fixed bottom-0 left-0 z-10 flex h-screen w-screen items-end justify-center bg-black/(--backdrop-opacity) lg:items-center"
      onClick={handleClick}
    >
      <div class="bg-background flex h-[80vh] w-125 max-w-full flex-col overflow-y-scroll rounded-md p-8 lg:h-[unset] lg:overflow-y-auto">
        <div class="border-b-divider-heavy mb-4 flex border-b-2 pb-4">
          <h1 class="grow text-xl font-bold">{props.title}</h1>
          <ButtonIcon icon="times" label="Close" onClick={props.onClose} />
        </div>
        <div class="grow">{props.children}</div>
        {props.footer ? <div>{props.footer}</div> : null}
      </div>
    </div>,
    root,
  );
}
