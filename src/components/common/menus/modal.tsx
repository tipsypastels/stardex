import hotkeys from "hotkeys-js";
import { createEffect, onCleanup, onMount, type JSXElement } from "solid-js";
import { Portal } from "solid-js/web";
import { ButtonIcon } from "../button";

const root = document.getElementById("root-modal")!;

export interface ModalProps {
  title: JSXElement;
  children: JSXElement;
  footer?: JSXElement;
  footerHasDivider?: boolean;
  onClose(): void;
}

let onClosePrev: (() => void) | undefined;

export function Modal(props: ModalProps) {
  onMount(() => {
    onClosePrev?.();
    onClosePrev = props.onClose;
  });

  onCleanup(() => {
    if (onClosePrev === props.onClose) {
      onClosePrev = undefined;
    }
  });

  function handleClick(e: MouseEvent) {
    if ((e.target as HTMLElement)?.parentNode === ref) {
      props.onClose();
    }
  }

  onMount(() => {
    // This is stable, and we have to capture it here because
    // accessing the props of an unmounted component will error.
    // eslint-disable-next-line solid/reactivity
    const { onClose } = props;
    hotkeys("esc", onClose);
    onCleanup(() => hotkeys.unbind("esc", onClose));
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
        <div class="flex max-h-[90dvh] w-125 max-w-full flex-col overflow-y-scroll rounded-t-md bg-background p-8 lg:overflow-y-auto lg:rounded-b-md">
          <div class="mb-4 flex border-b-2 border-b-divider-heavy pb-4">
            <h1 class="grow text-xl font-bold text-secondary">{props.title}</h1>
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
