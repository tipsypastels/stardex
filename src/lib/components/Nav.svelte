<script lang="ts">
  import { page } from "$app/state";
</script>

{#snippet link(href: string, name: string, icon: string)}
  {@const active = href === page.route.id}
  <li>
    <a {href} class:bg-red-500={active}>
      {name}
    </a>
  </li>
{/snippet}

<nav>
  <ul>
    {@render link("/settings", "Settings", "")}
  </ul>
</nav>
