export interface IconProps {
  name: string;
}

export function Icon(props: IconProps) {
  return <i class={`far fa-${props.name}`}></i>;
}
