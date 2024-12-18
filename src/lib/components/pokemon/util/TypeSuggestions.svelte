<script lang="ts" module>
  export const TYPE_SUGGESTIONS_LIST = "type_suggestions_list";
</script>

<script lang="ts">
  import { BUILTIN_TYPE_KEYS, resolveType } from "$lib/models/type";
</script>

<datalist id={TYPE_SUGGESTIONS_LIST}>
  {#each BUILTIN_TYPE_KEYS as typeKey}
    {@const type = resolveType(typeKey)}
    <option value={typeKey}>
      {type.name}
    </option>
  {/each}
</datalist>
