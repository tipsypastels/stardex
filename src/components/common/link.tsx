import type { JSXElement } from "solid-js";
import { tw } from "../../utils/style";

const LOOKS = {
  primary: "text-primary",
  secondary: "text-secondary",
  none: "",
  warning: "text-warning",
};

interface SharedProps {
  look?: keyof typeof LOOKS;
  bold?: boolean;
  small?: boolean;
  children: JSXElement;
}

export interface LinkProps extends SharedProps {
  to: string;
  blank?: boolean;
}

export function Link(props: LinkProps) {
  return (
    <a class={toClassList(props)} href={props.to} target={props.blank ? "_blank" : undefined}>
      {props.children}
    </a>
  );
}

export interface ButtonLinkProps extends SharedProps {
  disabled?: boolean;
  onClick(): void;
}

export function ButtonLink(props: ButtonLinkProps) {
  return (
    <button class={toClassList(props)} onClick={() => props.onClick()} disabled={props.disabled}>
      {props.children}
    </button>
  );
}

export interface UploadLinkProps extends SharedProps {
  onUpload(files: FileList): void;
  accept?: string;
  multiple?: boolean;
}

export function UploadLink(props: UploadLinkProps) {
  return (
    <label class={toClassList(props)}>
      <input
        class="hidden"
        type="file"
        accept={props.accept}
        multiple={props.multiple}
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

function toClassList({ look, bold, small }: SharedProps) {
  return tw`cursor-pointer underline ${LOOKS[look ?? "primary"]} ${bold ? `font-bold` : ""} ${small ? `text-sm` : ""} disabled:opacity-70 disabled:cursor-not-allowed`;
}
