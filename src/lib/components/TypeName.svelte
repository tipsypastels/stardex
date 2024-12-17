<script lang="ts">
  import { resolveType } from "$lib/models/type";

  interface Props {
    for: string;
  }

  let props: Props = $props();
  let type = $derived(resolveType(props.for));
</script>

<span style="color: {type.color}">
  {type.name}
</span>
