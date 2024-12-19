<script lang="ts">
  import type { Pokemon } from "$lib/models/pokemon";
  import { pokemon } from "$lib/state/pokemon";

  interface Props {
    index: number;
    mon: Pokemon;
    close(): void;
  }

  let { index, mon, close }: Props = $props();
</script>

<label class="flex items-center justify-center md:justify-normal">
  <input
    type="checkbox"
    class="mr-2"
    checked={mon.exclude}
    onchange={(e) => pokemon.setExclude(index, e.currentTarget.checked)}
  />
  <div>Exclude this Pokémon from recommendations.</div>
</label>
