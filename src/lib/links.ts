import { base } from "$app/paths";

export type PageLinkTo = keyof typeof PAGE_LINKS;

export const PAGE_LINKS = {
  editor: {
    name: "Editor",
    href: `${base}/`,
    icon: "table-columns",
  },
  export: {
    name: "Export",
    href: `${base}/export`,
    icon: "download",
  },
  settings: {
    name: "Settings",
    href: `${base}/settings`,
    icon: "gears",
  },
};
