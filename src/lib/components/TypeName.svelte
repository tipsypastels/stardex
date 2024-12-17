<script lang="ts">
  import { resolveType } from "$lib/models/type";
  import Icon from "./Icon.svelte";

  interface Props {
    for: string;
  }

  let props: Props = $props();
  let type = $derived(resolveType(props.for));
</script>

<span style="color: {type.color}">
  <span>
    <Icon name={type.icon} />
  </span>
  <span>
    {type.name}
  </span>
</span>
