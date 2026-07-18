export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function must<T>(value: T, message?: string): NonNullable<T> {
  assert(value, message);
  return value;
}

export function mustIndex(index: number, message?: string) {
  assert(index > -1, message);
  return index;
}
