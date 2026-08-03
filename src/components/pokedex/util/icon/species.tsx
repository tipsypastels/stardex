// Increment this every time you regenerate icons.
const CACHE_BUSTER = 0;
// This corresponds to a SCALE_MULT of 2.
// You'll need to regenerate icons if these change.
const WIDTH = 80;
const HEIGHT = 60;

export interface SpeciesIconProps {
  index: number;
  name: string;
}

export function SpeciesIcon(props: SpeciesIconProps) {
  return (
    <img
      alt={props.name}
      title={props.name}
      src={`species_icons/${props.index}.png?${CACHE_BUSTER}`}
      width={WIDTH}
      height={HEIGHT}
      style={{ "image-rendering": "pixelated" }}
    />
  );
}
