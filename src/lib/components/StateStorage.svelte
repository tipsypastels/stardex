<script lang="ts" module>
  export const STATE_STORAGE_KEY = "stardex_state";
</script>

<script lang="ts">
  import { fullState } from "$lib/state";

  $effect(() => {
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify($fullState));
  });
</script>
