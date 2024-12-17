<script lang="ts">
  import type { Species } from "$lib/models/species";

  // Based on https://github.com/smogon/pokemon-showdown-client/blob/f4baa241257350654aa441b1963e3b0761bbc51d/play.pokemonshowdown.com/src/panel-teambuilder-team.tsx#L170.
  // We double everything in size compared to that image.

  const SHEET = "https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png?v17";
  const SHEET_WIDTH = 480;
  const SCALE_2 = 2;

  interface Props {
    for: Species;
  }

  let props: Props = $props();
  let id = $derived(props.for.id);
  let top = $derived(Math.floor(id / 12) * 30 * SCALE_2);
  let left = $derived((id % 12) * 40 * SCALE_2);
</script>

<div
  role="img"
  aria-label={props.for.name}
  class="block h-[60px] w-[80px]"
  style="background: transparent url('{SHEET}') no-repeat scroll -{left}px -{top}px / {SHEET_WIDTH *
    SCALE_2}px; image-rendering: pixelated;"
></div>
