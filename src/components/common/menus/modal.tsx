import hotkeys from "hotkeys-js";
import { createEffect, onCleanup, type JSXElement } from "solid-js";
import { Portal } from "solid-js/web";
import { ButtonIcon } from "../button";

const root = document.getElementById("root-modal")!;

export interface ModalProps {
  title: JSXElement;
  children: JSXElement;
  footer?: JSXElement;
  footerHasDivider?: boolean;
  primaryBorder?: boolean;
  onClose(): void;
}

export function Modal(props: ModalProps) {
  function handleClick(e: MouseEvent) {
    if ((e.target as HTMLElement)?.parentNode === ref) {
      props.onClose();
    }
  }

  createEffect(() => {
    hotkeys("esc", props.onClose);
    onCleanup(() => hotkeys.unbind("esc"));
  });

  createEffect(() => {
    document.documentElement.classList.add("has-modal");
    onCleanup(() => document.documentElement.classList.remove("has-modal"));
  });

  let ref!: HTMLDivElement;

  return (
    <Portal mount={root} ref={ref}>
      <div
        class="fixed bottom-0 left-0 z-50 flex h-dvh w-screen items-end justify-center overscroll-contain bg-black/(--backdrop-opacity) lg:items-center"
        on:click={handleClick}
      >
        <div
          class="flex w-125 max-w-full flex-col overflow-y-scroll rounded-t-md bg-background p-8 lg:overflow-y-auto lg:rounded-b-md"
          classList={{ "border-2 border-primary": props.primaryBorder }}
        >
          <div class="mb-4 flex border-b-2 border-b-divider-heavy pb-4">
            <h1 class="grow text-xl font-bold" classList={{ "text-primary": props.primaryBorder }}>
              {props.title}
            </h1>
            <ButtonIcon icon="times" label="Close" onClick={() => props.onClose()} />
          </div>
          <div class="grow">{props.children}</div>
          {props.footer ? (
            <div
              class="mt-4"
              classList={{ "border-t-2 border-t-divider-heavy pt-4": props.footerHasDivider }}
            >
              {props.footer}
            </div>
          ) : null}
        </div>
      </div>
    </Portal>
  );
}
