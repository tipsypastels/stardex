import { Strictness } from "$lib/models2/strictness";
import { persistedWritable } from "$lib/utils/stores";

export const strictness = persistedWritable({
  key: "stardex_strictness",
  default: () => Strictness.DEFAULT,
  load: (key) => Strictness.of(key),
});
