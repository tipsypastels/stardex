import { createActions } from "./_actions";

export const pokedexFilterType = createActions(
  undefined as string | undefined,
  (store) => ({
    set(value: string | undefined) {
      store.set(value ? value : undefined);
    },
  }),
);
