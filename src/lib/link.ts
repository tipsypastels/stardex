import { base } from "$app/paths";
import { page } from "$app/state";

// empty `base` is `.` in SSR and empty in browser
export function isLinkActive(href: string) {
  const stableBase = (base as string) === "." ? "" : base;
  return href === `${stableBase}${page.route.id}`;
}
