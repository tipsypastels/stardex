import type { ReadonlySignal, Signal } from "@preact/signals";

export type ReadonlySignalled<T> = { [K in keyof T]: ReadonlySignal<T[K]> };

export function readonly<T>(signal: Signal<T>): ReadonlySignal<T> {
  return signal;
}
