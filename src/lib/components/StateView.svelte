<script lang="ts">
  import { editorOpen, pokemon, regions, strictness } from "$lib/state";

  let fullState = $derived({
    pokemon: $pokemon,
    regions: $regions,
    strictness: $strictness,
    editorOpen: $editorOpen,
  });
</script>

<pre class="overflow-x-scroll">{JSON.stringify(fullState, null, 2)}</pre>
