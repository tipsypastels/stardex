const SHEET = "https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png?v22";
const SHEET_WIDTH = 480;
// We double everything in size compared to Smogon.
const SCALE_2 = 2;

export interface SpeciesIconProps {
  index: number;
  name: string;
}

export function SpeciesIcon(props: SpeciesIconProps) {
  const top = () => Math.floor(props.index / 12) * 30 * SCALE_2;
  const left = () => (props.index % 12) * 40 * SCALE_2;

  return (
    <div
      role="img"
      title={props.name}
      aria-label={props.name}
      class="block h-15 w-20 dim"
      style={{
        "background-image": `url('${SHEET}')`,
        "background-repeat": "no-repeat",
        "background-attachment": "scroll",
        "background-position": `-${left()}px -${top()}px`,
        "background-size": `${SHEET_WIDTH * SCALE_2}px`,
        "image-rendering": "pixelated",
      }}
    />
  );
}
