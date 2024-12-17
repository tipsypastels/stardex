<script lang="ts" module>
  import { base } from "$app/paths";

  export type IconLinkTo = keyof typeof ICON_LINKS;

  export const ICON_LINKS = {
    pokedex: {
      name: "Pokédex",
      href: `${base}/`,
      icon: "table-columns",
    },
    breakdown: {
      name: "Breakdown",
      href: `${base}/breakdown`,
      icon: "pie-chart",
    },
    compare: {
      name: "Compare",
      href: `${base}/compare`,
      icon: "code-compare",
    },
    settings: {
      name: "Settings",
      href: `${base}/settings`,
      icon: "gears",
    },
    tutorial: {
      name: "Tutorial",
      href: `${base}/tutorial`,
      icon: "location-question",
    },
  };
</script>

<script lang="ts">
  import Icon from "./Icon.svelte";

  interface Props {
    to: IconLinkTo;
  }

  let { to }: Props = $props();
  let link = $derived(ICON_LINKS[to]);
</script>

<a class="whitespace-nowrap" href={link.href}>
  <span>
    <Icon name={link.icon} />
  </span>

  <span class="underline">
    {link.name}
  </span>
</a>
