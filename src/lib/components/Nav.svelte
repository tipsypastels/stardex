<script lang="ts">
  import { isLinkActive } from "$lib/link";
  import Icon from "./Icon.svelte";
  import { ICON_LINKS } from "./IconLink.svelte";
</script>

<nav class="mb-8 border-y-2 border-y-slate-300">
  <ul class="grid grid-cols-[1fr] gap-4 py-2 md:grid-cols-4">
    {#each Object.values(ICON_LINKS) as link}
      {@const active = isLinkActive(link.href)}
      <li>
        <a href={link.href} class="flex justify-center" class:text-lime-600={active}>
          <span class="mr-2">
            <Icon name={link.icon} />
          </span>
          <span>
            {link.name}
          </span>
        </a>
      </li>
    {/each}
  </ul>
</nav>
