<script lang="ts">
  import { resolveType, type Type } from "$lib/models/type";

  interface Props {
    types: (string | Type)[];
  }

  let { types: types_ }: Props = $props();
  let types = $derived(types_.map((t) => (typeof t === "string" ? resolveType(t) : t)));
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
