import { Show, type JSXElement } from "solid-js";
import { validationError, type ValidationError } from "../../../models/ui/error/validation";
import { InitialValidationError } from "./initial";

export interface CatchValidationErrorProps {
  children: JSXElement;
}

export function CatchValidationError(props: CatchValidationErrorProps) {
  return (
    <Show when={validationError()} fallback={props.children}>
      {(error) => render(error())}
    </Show>
  );
}

function render(error: ValidationError) {
  switch (error.phase) {
    case "initial": {
      return <InitialValidationError error={error.error} />;
    }
    case "import": {
      throw new Error("TODO");
    }
  }
}
