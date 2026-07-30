/* -------------------------------------------------------------------------- */
/*                                    Maps                                    */
/* -------------------------------------------------------------------------- */

export function mapOfArraysAppend<K, V>(map: Map<K, V[]>, key: K, ...values: V[]) {
  const entry = map.get(key);
  if (entry) {
    entry.push(...values);
  } else {
    map.set(key, values);
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Iterators                                 */
/* -------------------------------------------------------------------------- */

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
