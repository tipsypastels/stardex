export function mapOfArraysAppend<K, V>(map: Map<K, V[]>, key: K, ...values: V[]) {
  const entry = map.get(key);
  if (entry) {
    entry.push(...values);
  } else {
    map.set(key, values);
  }
}
