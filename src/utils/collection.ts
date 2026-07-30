/* -------------------------------------------------------------------------- */
/*                                   Arrays                                   */
/* -------------------------------------------------------------------------- */

export function arraySortByRegex<T>(input: T[], toKey: (value: T) => string, regexes: RegExp[]) {
  function rank(key: string) {
    return regexes.findIndex((re) => re.test(key));
  }

  return input
    .map((value, originalIndex) => ({ value, originalIndex, rank: rank(toKey(value)) }))
    .filter((entry) => entry.rank !== -1)
    .sort((a, b) => a.rank - b.rank || a.originalIndex - b.originalIndex)
    .map((entry) => entry.value);
}

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
