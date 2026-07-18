import type { Ref } from "solid-js";

const LOOKS = {
  primary: "border-b-primary",
};

export interface InputProps {
  ref?: Ref<HTMLInputElement>;
  look?: keyof typeof LOOKS;
  value: string;
  list?: string;
  size?: "double";
  onChange?(e: Event & { currentTarget: HTMLInputElement }): void;
  onBlur?(e: Event & { currentTarget: HTMLInputElement }): void;
  onKeyUp?(e: Event & { currentTarget: HTMLInputElement }): void;
}

export function Input(props: InputProps) {
  return (
    <input
      ref={props.ref}
      class={`border-0 border-b-2 ${props.size === "double" ? "w-40" : "w-20"} ${LOOKS[props.look ?? "primary"]}`}
      type="text"
      value={props.value}
      list={props.list}
      onChange={(e) => props.onChange?.(e)}
      onBlur={(e) => props.onBlur?.(e)}
      onKeyUp={(e) => props.onKeyUp?.(e)}
    />
  );
}
