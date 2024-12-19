import { base } from "$app/paths";

export type PageLinkTo = keyof typeof PAGE_LINKS;

export const PAGE_LINKS = {
  editor: {
    name: "Editor",
    href: `${base}/`,
    icon: "table-columns",
  },
  files: {
    name: "Files",
    href: `${base}/files`,
    icon: "files",
  },
  settings: {
    name: "Settings",
    href: `${base}/settings`,
    icon: "gears",
  },
};
