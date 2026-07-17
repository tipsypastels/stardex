export function stored(key: string) {
  return {
    load() {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as unknown) : undefined;
    },
    dump(value: unknown) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    clear() {
      localStorage.removeItem(key);
    },
  };
}
