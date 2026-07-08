import { Icon } from "./icon";

const LOOKS = {
  lesser: "text-foreground-lesser",
};

export interface ButtonIconProps {
  icon: string;
  look: keyof typeof LOOKS;
  label: string;
  onClick(): void;
}

export function ButtonIcon(props: ButtonIconProps) {
  return (
    <button
      class={`cursor-pointer ${LOOKS[props.look]}`}
      title={props.label}
      aria-label={props.label}
      onClick={props.onClick}
    >
      <Icon name={props.icon} />
    </button>
  );
}
