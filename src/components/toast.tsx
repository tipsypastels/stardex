import { Show } from "@preact/signals/utils";
import { useEffect, useState } from "preact/hooks";
import type { Toast } from "../models/toast";
import { toasts } from "../state/toast";
import { Icon } from "./common/icon";

export function Toast() {
  return <Show when={toasts.current}>{(toast) => <ToastInner toast={toast} />}</Show>;
}

const DURATION = 3000;

interface ToastInnerProps {
  toast: Toast;
}

function ToastInner({ toast }: ToastInnerProps) {
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsIn(true));

    const fadeTimeout = setTimeout(() => setIsIn(false), DURATION);
    const removeTimeout = setTimeout(() => toasts.shift(), DURATION + 300);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, [toast]);

  return (
    <div
      className={`fixed bottom-8 z-40 transform rounded-lg border-2 border-divider-heavy bg-background px-8 py-4 shadow-shadow transition-all duration-300 ${
        isIn
          ? "translate-y-0 scale-100 opacity-100 ease-out"
          : "translate-y-4 scale-95 opacity-0 ease-in"
      } `}
      style={`left: 50%; transform: translateX(-50%);`}
    >
      <div class="flex items-center space-x-2">
        <span class="text-primary">
          <Icon name={toast.icon} />
        </span>
        <p class="text-sm font-medium">{toast.text}</p>
      </div>
    </div>
  );
}
