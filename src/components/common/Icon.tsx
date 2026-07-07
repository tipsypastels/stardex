export interface IconProps {
  name: string;
}

export function Icon(props: IconProps) {
  return <i class={`fas fa-${props.name}`}></i>;
}
