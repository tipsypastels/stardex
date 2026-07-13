import { type ReadonlySignal, type Signal } from "@preact/signals";

export type ReadonlySignalled<T> = { [K in keyof T]: ReadonlySignal<T[K]> };

export function readonly<T>(signal: Signal<T>): ReadonlySignal<T> {
  return signal;
}

export interface Lifter {
  change(): void;
  onChange(f: () => void): void;
}

export function makeLifter(): Lifter {
  let onChange: (() => void) | undefined;
  return {
    change() {
      onChange?.();
    },
    onChange(f) {
      onChange = f;
    },
  };
}
