import type { PokedexFormat } from "$lib/models/pokedex_format";
import { writable } from "svelte/store";
import { createStorage } from "./_storage";

const storage = createStorage<PokedexFormat>("stardex_pokedex_format");
const initial = storage.initial ?? "icons";

export const pokedexFormat = writable(initial);
export const pokedexFormatPersister = storage.persister(pokedexFormat);
