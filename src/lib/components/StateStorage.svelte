<script lang="ts" module>
  export const STATE_STORAGE_KEY = "stardex_state";
</script>

<script lang="ts">
  import { storableState } from "$lib/state";

  $effect(() => {
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify($storableState));
  });
</script>
