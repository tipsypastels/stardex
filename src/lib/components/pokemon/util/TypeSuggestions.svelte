<script lang="ts" module>
  export const TYPE_SUGGESTIONS_LIST = "type_suggestions_list";
</script>

<script lang="ts">
  import { BuiltinType } from "$lib/models/type";
</script>

<datalist id={TYPE_SUGGESTIONS_LIST}>
  {#each BuiltinType.ALL as type}
    <option value={type.key}>
      {type.name}
    </option>
  {/each}
</datalist>
