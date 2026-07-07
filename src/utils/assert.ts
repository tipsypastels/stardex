export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function unwrap<T>(value: T, message?: string): NonNullable<T> {
  assert(value, message);
  return value;
}
