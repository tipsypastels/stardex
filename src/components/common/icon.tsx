export interface IconProps {
  name: string;
  class?: string;
}

export function Icon(props: IconProps) {
  return <i class={`fas fa-${props.name} ${props.class ?? ""}`} />;
}
