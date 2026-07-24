import { Icon } from "../../common/icon";

export interface CustomIconProps {
  name: string;
  url: string;
}

export function CustomIcon(props: CustomIconProps) {
  return (
    <div
      role="img"
      title={props.name}
      aria-label={props.name}
      class="h-15 w-20 dim"
      style={{
        "background-image": `url("${props.url}")`,
        "background-repeat": "no-repeat",
        "background-position": "center",
        "image-rendering": "pixelated",
      }}
    />
  );
}

export function CustomIconLoading(props: Pick<CustomIconProps, "name">) {
  return (
    <div
      role="img"
      title={props.name}
      aria-label={props.name}
      class="flex h-15 w-20 items-center justify-center rounded-full text-3xl text-foreground-muted"
    >
      <Icon name="spinner" class="fa-spin" />
    </div>
  );
}
