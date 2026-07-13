import { Icon } from "./icon";

const LOOKS = {
  lesser: "text-foreground-lesser",
};

export interface ButtonIconProps {
  icon: string;
  look?: keyof typeof LOOKS;
  label: string;
  onClick(): void;
}

export function ButtonIcon({ icon, look = "lesser", label, onClick }: ButtonIconProps) {
  return (
    <button
      class={`cursor-pointer touch-manipulation ${LOOKS[look]}`}
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      <Icon name={icon} />
    </button>
  );
}
