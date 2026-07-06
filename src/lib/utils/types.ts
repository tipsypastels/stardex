export type Rekey<T, FromKey extends keyof T, ToKey extends string> = Omit<T, FromKey> &
  Record<ToKey, T[FromKey]>;
