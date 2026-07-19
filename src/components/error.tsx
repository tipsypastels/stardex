import { Show, type JSXElement } from "solid-js";
import { validationError } from "../models/ui/error/validation";

export interface CatchValidationErrorProps {
  children: JSXElement;
}

export function CatchValidationError(props: CatchValidationErrorProps) {
  return (
    <Show when={validationError()} fallback={props.children}>
      {(error) => `${error()}`}
    </Show>
  );
}
