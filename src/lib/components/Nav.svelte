<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/state";
  import { ICON_LINKS } from "./IconLink.svelte";
</script>

<nav>
  <ul>
    {#each Object.values(ICON_LINKS) as link}
      <li>
        <a href={link.href}>
          {link.name}
        </a>
      </li>
    {/each}
  </ul>
</nav>
