import type { ReadonlySignal, Signal } from "@preact/signals";

export function readonly<T>(signal: Signal<T>): ReadonlySignal<T> {
  return signal;
}
