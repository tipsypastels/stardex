import type { Strictness } from "$lib/models/strictness";
import { writable } from "svelte/store";
import { createStorage } from "./_storage";

const storage = createStorage<Strictness>("stardex_strictness");
const initial = storage.initial ?? "normal";

export const strictness = writable(initial);

storage.persist(strictness);
