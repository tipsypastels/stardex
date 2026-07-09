import type { ComponentChildren } from "preact";

const LOOKS = {
  primary: "bg-primary text-foreground-primary",
  // TODO: Figure out exact use of secondary.
  secondary: "bg-secondary text-foreground-secondary",
};

export interface ButtonProps {
  look?: keyof typeof LOOKS;
  children: ComponentChildren;
  onClick(): void;
}

export function Button({ look = "primary", children, onClick }: ButtonProps) {
  return (
    <button class={`cursor-pointer rounded-md px-4 py-2 ${LOOKS[look]}`} onClick={onClick}>
      {children}
    </button>
  );
}
