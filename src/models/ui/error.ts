import { catchError, createSignal } from "solid-js";

export interface StartupError {
  model: string;
  inner: Error;
}

export const [startupError, setStartupError] = createSignal<StartupError>();

export function catchStartupError(model: string, f: () => void) {
  return (
    catchError(
      () => {
        f();
        return false;
      },
      (inner) => {
        setStartupError({ model, inner });
      },
    ) ?? true
  );
}
