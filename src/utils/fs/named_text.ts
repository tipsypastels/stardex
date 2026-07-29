export interface NamedText {
  name: string;
  text: string;
}

export function mergeNamedTextArrays(left: NamedText[], right: NamedText[]): NamedText[] {
  return Object.entries({
    ...Object.fromEntries(left.map((f) => [f.name, f.text])),
    ...Object.fromEntries(right.map((f) => [f.name, f.text])),
  }).map(([name, text]) => ({ name, text }));
}
