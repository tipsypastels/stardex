<script lang="ts">
  import type { Type } from "$lib/models/type";

  interface Props {
    types: Type[];
  }

  let { types }: Props = $props();
</script>

<ul class="absolute left-0 top-0 flex">
  {#each types as type}
    <li
      class="mr-1 h-[10px] w-[10px] rounded-full"
      style="background-color: {type.color}"
      title="{type.name} Type"
    ></li>
  {/each}
</ul>
