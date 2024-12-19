<script lang="ts">
  import { resolveType, type Type } from "$lib/models/type";
  import Icon from "./Icon.svelte";

  interface Props {
    for: string | Type;
  }

  let props: Props = $props();
  let type = $derived(typeof props.for === "string" ? resolveType(props.for) : props.for);
</script>

<span class="whitespace-nowrap" style="color: {type.color}">
  <span>
    <Icon name={type.icon} />
  </span>
  <span>
    {type.name}
  </span>
</span>
