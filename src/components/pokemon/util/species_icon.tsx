import type { Species } from "../../../models/species";

// Based on https://github.com/smogon/pokemon-showdown-client/blob/f4baa241257350654aa441b1963e3b0761bbc51d/play.pokemonshowdown.com/src/panel-teambuilder-team.tsx#L170.
// We double everything in size compared to that image.
const SHEET = "https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png?v22";
const SHEET_WIDTH = 480;
const SCALE_2 = 2;

export interface SpeciesIconProps {
  species: Pick<Species, "id" | "name">;
}

export function SpeciesIcon(props: SpeciesIconProps) {
  const top = Math.floor(props.species.id / 12) * 30 * SCALE_2;
  const left = (props.species.id % 12) * 40 * SCALE_2;

  return (
    <div
      role="img"
      aria-label={props.species.name}
      class="block h-15 w-20"
      style={`background: transparent url('${SHEET}') no-repeat scroll -${left}px -${top}px / ${
        SHEET_WIDTH * SCALE_2
      }px; image-rendering: pixelated;`}
    ></div>
  );
}
