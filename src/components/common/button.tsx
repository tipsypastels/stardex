import type { JSXElement } from "solid-js";
import { tw } from "../../utils/string";
import { Icon } from "./icon";

const LOOKS = {
  primary: tw`bg-primary text-primary-foreground`,
  secondary: tw`bg-secondary text-secondary-foreground`,
  error: tw`bg-error text-white`,
};

export interface ButtonProps {
  look?: keyof typeof LOOKS;
  disabled?: boolean;
  children: JSXElement;
  onClick(): void;
}

export function Button(props: ButtonProps) {
  return (
    <button
      class={`cursor-pointer rounded-md px-4 py-2 ${LOOKS[props.look ?? "primary"]} disabled:cursor-not-allowed disabled:opacity-70`}
      disabled={props.disabled}
      onClick={() => props.onClick()}
    >
      {props.children}
    </button>
  );
}

const ICON_LOOKS = {
  muted: tw`text-foreground-muted`,
};

export interface ButtonIconProps {
  icon: string;
  look?: keyof typeof ICON_LOOKS;
  label: string;
  onClick(): void;
}

export function ButtonIcon(props: ButtonIconProps) {
  return (
    <button
      class={`cursor-pointer ${ICON_LOOKS[props.look ?? "muted"]}`}
      title={props.label}
      aria-label={props.label}
      onClick={() => props.onClick()}
    >
      <Icon name={props.icon} />
    </button>
  );
}

export interface UploadButtonProps {
  look?: keyof typeof LOOKS;
  children: JSXElement;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onUpload(files: FileList): void;
}

export function UploadButton(props: UploadButtonProps) {
  return (
    <label
      class={`cursor-pointer rounded-md px-4 py-2 text-center ${LOOKS[props.look ?? "primary"]}`}
      classList={{ "cursor-not-allowed! opacity-70": props.disabled }}
    >
      <input
        class="hidden"
        type="file"
        accept={props.accept}
        multiple={props.multiple}
        disabled={props.disabled}
        onChange={(e) => {
          if (e.currentTarget.files?.length) {
            props.onUpload(e.currentTarget.files);
          }
        }}
      />
      {props.children}
    </label>
  );
}
