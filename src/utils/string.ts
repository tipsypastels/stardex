export function capitalize(s: string) {
  if (s === "") return s;
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

export function capitalizeWords(s: string) {
  return s.split(/\s+/).map(capitalize).join(" ");
}
