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
  size?: "double";
}

export const Input = forwardRef(
  ({ look = "primary", size, ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <input
        ref={ref}
        class={`border-0 border-b-2 ${size === "double" ? "w-40" : "w-20"} ${LOOKS[look]}`}
        type="text"
        {...props}
      />
    );
  },
);
