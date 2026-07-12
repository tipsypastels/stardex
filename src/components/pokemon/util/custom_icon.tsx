export interface CustomIconProps {
  dataUrl: string;
  name: string;
}

export function CustomIcon({ dataUrl, name }: CustomIconProps) {
  return (
    <div
      role="img"
      title={name}
      aria-label={name}
      class="h-15 w-20 dim"
      style={`background: transparent url("${dataUrl}") no-repeat center; image-rendering: pixelated;`}
    />
  );
}
