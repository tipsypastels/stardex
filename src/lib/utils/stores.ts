import { derived, writable, type Readable, type Writable } from "svelte/store";

export interface PersistedWritableOptions<T> {
  key: string;
  default(): T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load(object: any): T;
  dump?(value: T): unknown;
}

export interface PersistedWritable<T> extends Writable<T> {
  persisted: Readable<void>;
}

export function persistedWritable<T>(options: PersistedWritableOptions<T>): PersistedWritable<T> {
  const raw = localStorage.getItem(options.key);
  const initial = raw ? options.load(JSON.parse(raw)) : options.default();
  const store = writable(initial);

  const persisted = derived<Writable<T>, void>(store, (value) => {
    const object = options.dump?.(value) ?? value;
    const raw = JSON.stringify(object);
    localStorage.setItem(options.key, raw);
  });

  return {
    ...store,
    persisted,
  };
}

export function reducible<T, A, W extends Writable<T>>(
  store: W,
  f: (store: W) => A,
): Omit<W, "set" | "update"> & A {
  const actions = f(store);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { set: _, update: __, ...rest } = store;
  return { ...rest, ...actions };
}
