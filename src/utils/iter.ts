export function* iterMap<T, U>(iter: Iterable<T>, f: (item: T) => U) {
  for (const item of iter) {
    yield f(item);
  }
}
