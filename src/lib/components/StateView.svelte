<script lang="ts">
  import { rawPokemon, resolvedPokemon } from "$lib/state";

  const data = $derived({
    rawPokemon: $rawPokemon,
    resolvedPokemon: $resolvedPokemon,
  });
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>
