<script lang="ts">
  import { PAGE_LINKS, type PageLinkTo } from "$lib/links";
  import Icon from "./Icon.svelte";

  interface Props {
    to: PageLinkTo;
  }

  let { to }: Props = $props();
  let link = $derived(PAGE_LINKS[to]);
</script>

<a class="whitespace-nowrap" href={link.href}>
  <span>
    <Icon name={link.icon} />
  </span>

  <span class="underline">
    {link.name}
  </span>
</a>
