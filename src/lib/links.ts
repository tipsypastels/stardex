import { base } from "$app/paths";

export type PageLinkTo = keyof typeof PAGE_LINKS;

export const PAGE_LINKS = {
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
};
