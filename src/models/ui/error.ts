import { catchError, createSignal } from "solid-js";

export const [startupError, setStartupError] = createSignal<Error>();

export function catchStartupError(f: () => void) {
  return (
    catchError(
      () => {
        f();
        return false;
      },
      (error) => {
        setStartupError(error);
      },
    ) ?? true
  );
}
