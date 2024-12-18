<script lang="ts">
  import type { Pokemon } from "$lib/models/pokemon";

  interface Props {
    index: number;
    mon: Pokemon;
    close(): void;
  }

  let { index, mon, close }: Props = $props();
</script>
