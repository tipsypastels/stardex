import { writable } from "svelte/store";
import { createStorage } from "./_storage";

const storage = createStorage<string>("stardex_last_dismissed_notice");

export const lastDismissedNoticeDate = writable(new Date(storage.initial ?? 0));
export const lastDismissedNoticeDatePersister = storage.persister(lastDismissedNoticeDate);
