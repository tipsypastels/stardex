import { persistedWritable } from "$lib/utils/stores";

export const lastDismissedNoticeDate = persistedWritable({
  key: "stardex_last_dismissed_notice",
  default: () => new Date(0),
  load: (date) => new Date(date),
});
