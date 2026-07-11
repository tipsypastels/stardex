import { computed, createModel, signal } from "@preact/signals";
import { List as IList } from "immutable";

export type ToastState = "moving-in" | "in" | "moving-out";

export interface Toast {
  icon: string;
  text: string;
}

export type ToastList = InstanceType<typeof ToastList>;

export const ToastList = createModel(() => {
  const all = signal(IList<Toast>());
  const current = computed(() => all.value.first());
  return {
    current,
    push(toast: Toast) {
      all.value = all.value.push(toast);
    },
    shift() {
      all.value = all.value.shift();
    },
  };
});
