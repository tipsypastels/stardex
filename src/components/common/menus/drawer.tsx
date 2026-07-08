import { batch, signal, useComputed, useSignal, type ReadonlySignal } from "@preact/signals";
import hotkeys from "hotkeys-js";
import type { ComponentChildren } from "preact";
import { createPortal, useEffect } from "preact/compat";

const root = document.getElementById("app-modal")!;
const viewportRect = signal({ left: 0, top: 0 });

export interface DrawerProps {
  children: ComponentChildren;
  onClose(): void;
}

export function Drawer({ children, onClose }: DrawerProps) {
  const rect = useComputed(() => ({
    left: viewportRect.value.left + document.documentElement.scrollLeft,
    top: viewportRect.value.top + document.documentElement.scrollTop,
  }));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.parentNode === root || !root.contains(e.target as HTMLElement)) {
        onClose();
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [onClose]);

  useEffect(() => {
    hotkeys("esc", onClose);
    return () => hotkeys.unbind("esc");
  }, [onClose]);

  return createPortal(
    <div class="fixed bottom-0 left-0 z-10 flex h-screen w-screen justify-end bg-black/(--backdrop-opacity)">
      <div class="bg-secondary max-w-full text-white">{children}</div>

      {/* <div class="absolute mt-8" style={`left: ${rect.value.left}px; top: ${rect.value.top}px`}>
        <div class="bg-background border-secondary shadow-shadow max-w-full rounded-md border-2 shadow-xl">
          {children}
        </div>
      </div> */}
    </div>,
    root,
  );
}

export interface DrawerState {
  isOpen: ReadonlySignal<boolean>;
  open(element: HTMLElement): void;
  close(): void;
}

export function useDrawerState(): DrawerState {
  const isOpen = useSignal(false);
  return {
    isOpen,
    open(element) {
      batch(() => {
        viewportRect.value = element.getBoundingClientRect();
        isOpen.value = true;
      });
    },
    close() {
      isOpen.value = false;
    },
  };
}

export interface CabinetState<K extends string> {
  current: ReadonlySignal<K | undefined>;
  open(key: K, element: HTMLElement): void;
  close(): void;
}

export function useCabinetState<K extends string>(): CabinetState<K> {
  const current = useSignal<K>();
  return {
    current,
    open(key, element) {
      batch(() => {
        viewportRect.value = element.getBoundingClientRect();
        current.value = key;
      });
    },
    close() {
      current.value = undefined;
    },
  };
}
