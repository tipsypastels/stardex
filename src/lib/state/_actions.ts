import { writable, type Readable, type Writable } from "svelte/store";

export type Actions<T, A> = Readable<T> & A;
export type ActionsFactory<T, A> = (store: Writable<T>) => A;

export function createActions<T, A>(initial: T, factory: ActionsFactory<T, A>): Actions<T, A> {
  const store = writable(initial);
  const actions = factory(store);
  return { ...actions, subscribe: store.subscribe };
}
