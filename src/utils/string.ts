export function capitalize(s: string) {
  if (s === "") return s;
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

export function capitalizeWords(s: string) {
  return s.split(/\s+/).map(capitalize).join(" ");
}

export function undefinedIfEmpty(s: string) {
  return s === "" ? undefined : s;
}

export function sortStrings(a: string, b: string) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
