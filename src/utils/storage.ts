export function stored<T, U = T>(key: string) {
  return {
    load() {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : undefined;
    },
    dump(value: U) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    clear() {
      localStorage.removeItem(key);
    },
  };
}
