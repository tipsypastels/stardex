import { catchError, createSignal } from "solid-js";

export const [validationError, setValidationError] = createSignal<Error>();

export function catchValidationError(f: () => void): boolean {
  return (
    catchError(() => {
      f();
      return false;
    }, setValidationError) ?? true
  );
}
