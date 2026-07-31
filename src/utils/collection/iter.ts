export function* iterMap<T, U>(iter: Iterable<T>, f: (item: T) => U) {
  for (const item of iter) {
    yield f(item);
  }
}

export function* iterFilter<T>(iter: Iterable<T>, f: (item: T) => boolean) {
  for (const item of iter) {
    if (f(item)) {
      yield item;
    }
  }
}
