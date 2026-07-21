import type { Ref } from "solid-js";

const LOOKS = {
  primary: "border-b-primary",
};

export interface InputProps {
  ref?: Ref<HTMLInputElement>;
  look?: keyof typeof LOOKS;
  class?: string;
  value: string;
  list?: string;
  short?: boolean;
  visuallyLowercase?: boolean;
  onInput?(e: Event & { currentTarget: HTMLInputElement }): void;
  onChange?(e: Event & { currentTarget: HTMLInputElement }): void;
  onBlur?(e: Event & { currentTarget: HTMLInputElement }): void;
  onKeyUp?(e: KeyboardEvent & { currentTarget: HTMLInputElement }): void;
}

export function Input(props: InputProps) {
  return (
    <input
      ref={props.ref}
      class={`border-0 border-b-2 lowercase ${LOOKS[props.look ?? "primary"]} ${props.class}`}
      classList={{ "py-0": props.short, "lowercase": props.visuallyLowercase }}
      type="text"
      value={props.value}
      list={props.list}
      onInput={(e) => props.onInput?.(e)}
      onChange={(e) => props.onChange?.(e)}
      onBlur={(e) => props.onBlur?.(e)}
      onKeyUp={(e) => props.onKeyUp?.(e)}
    />
  );
}
