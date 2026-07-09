import type { HTMLAttributes } from "preact";
import { forwardRef, type ForwardedRef } from "preact/compat";

const LOOKS = {
  primary: "border-b-primary",
};

type ForwardedAttributes = "onChange" | "onBlur" | "onKeyUp";

export interface InputProps extends Pick<HTMLAttributes<HTMLInputElement>, ForwardedAttributes> {
  look?: keyof typeof LOOKS;
  value: string;
  list?: string;
}

export const Input = forwardRef(
  ({ look = "primary", ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <input ref={ref} class={`w-20 border-0 border-b-2 ${LOOKS[look]}`} type="text" {...props} />
    );
  },
);
