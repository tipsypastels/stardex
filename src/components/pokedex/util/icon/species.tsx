const SHEET = "https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png?v22";
const SHEET_WIDTH = 480;

export interface SpeciesIconProps {
  index: number;
  name: string;
}

export function SpeciesIcon(props: SpeciesIconProps) {
  const top = () => Math.floor(props.index / 12) * 30;
  const left = () => (props.index % 12) * 40;

  return (
    <div class="block h-15 w-20 overflow-hidden dim">
      <div
        role="img"
        title={props.name}
        aria-label={props.name}
        class="h-7.5 w-10 origin-top-left"
        style={{
          "background-image": `url('${SHEET}')`,
          "background-repeat": "no-repeat",
          "background-position": `-${left()}px -${top()}px`,
          "background-size": `${SHEET_WIDTH}px`,
          "image-rendering": "pixelated",
          "transform": `scale(2)`,
        }}
      />
    </div>
  );
}
