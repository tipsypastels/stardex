<script lang="ts">
  import { pokemon } from "$lib/state";

  const data = $derived({
    pokemon: $pokemon,
  });
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>
