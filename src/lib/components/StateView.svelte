<script lang="ts">
  import { pokemon, regions, strictness } from "$lib/state";

  let fullState = $derived({
    pokemon: $pokemon,
    regions: $regions,
    strictness: $strictness,
  });
</script>

<pre>{JSON.stringify(fullState, null, 2)}</pre>
