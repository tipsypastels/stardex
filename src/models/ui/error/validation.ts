import { catchError, createSignal } from "solid-js";

export interface ValidationError {
  error: Error;
  phase: "initial" | "import";
}

export const [validationError, setValidationError] = createSignal<ValidationError>();

export function catchInitialValidationError(f: () => void): boolean {
  return (
    catchError(
      () => {
        f();
        return false;
      },
      (error) => {
        setValidationError({ error, phase: "initial" });
      },
    ) ?? true
  );
}
