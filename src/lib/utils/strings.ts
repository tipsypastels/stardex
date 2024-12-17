export function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

export function sortStrings(a: string, b: string) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
