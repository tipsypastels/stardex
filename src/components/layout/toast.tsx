import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { toasts, type Toast } from "../../models/ui/toast";
import { Icon } from "../common/icon";

export function Toast() {
  return (
    <Show when={toasts.current} keyed>
      {(toast) => <ToastInner toast={toast} />}
    </Show>
  );
}

const DURATION = 3000;

interface ToastInnerProps {
  toast: Toast;
}

function ToastInner(props: ToastInnerProps) {
  const [isIn, setIsIn] = createSignal(false);

  onMount(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setIsIn(true)));

    const fadeTimeout = setTimeout(() => setIsIn(false), DURATION);
    const removeTimeout = setTimeout(() => toasts.next(), DURATION + 300);

    onCleanup(() => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    });
  });

  return (
    <div
      class={`fixed bottom-8 z-40 transform rounded-lg border-2 border-divider-heavy bg-background px-8 py-4 shadow-shadow transition-all duration-300 ${
        isIn()
          ? "translate-y-0 scale-100 opacity-100 ease-out"
          : "translate-y-4 scale-95 opacity-0 ease-in"
      } `}
      style={{ left: "50%", transform: "translateX(-50%)" }}
    >
      <div class="flex items-center space-x-2">
        <span class="text-primary">
          <Icon name={props.toast.icon} />
        </span>
        <p class="text-sm font-medium">{props.toast.text}</p>
      </div>
    </div>
  );
}
