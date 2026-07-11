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
  large?: boolean;
  onClose(): void;
}

export function Modal({ title, children, footer, large, onClose }: ModalProps) {
  function handleClick(e: MouseEvent) {
    if ((e.target as HTMLElement)?.parentNode === root) {
      onClose();
    }
  }

  useEffect(() => {
    hotkeys("esc", onClose);
    return () => hotkeys.unbind("esc");
  }, [onClose]);

  useEffect(() => {
    document.documentElement.classList.add("has-modal");
    return () => document.documentElement.classList.remove("has-modal");
  });

  return createPortal(
    <div
      class="fixed bottom-0 left-0 z-50 flex h-dvh w-screen items-end justify-center overscroll-contain bg-black/(--backdrop-opacity) lg:items-center"
      onClick={handleClick}
    >
      <div
        class={`flex w-125 max-w-full flex-col overflow-y-scroll rounded-md bg-background p-8 lg:h-[unset] lg:overflow-y-auto ${large ? "h-[80vh]" : "h-[60vh]"}`}
      >
        <div class="mb-4 flex border-b-2 border-b-divider-heavy pb-4">
          <h1 class="grow text-xl font-bold">{title}</h1>
          <ButtonIcon icon="times" label="Close" onClick={onClose} />
        </div>
        <div class="grow">{children}</div>
        {footer ? <div class="mt-4">{footer}</div> : null}
      </div>
    </div>,
    root,
  );
}
