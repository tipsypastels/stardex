<script lang="ts">
  import { rawPokemon } from "$lib/state";

  const data = $derived({
    rawPokemon: $rawPokemon,
  });
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>
