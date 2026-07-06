import { Projects } from "$lib/models2/project";
import { persistedWritable, reducible } from "$lib/utils/stores";

export const projects = reducible(
  persistedWritable({
    key: "stardex_projects",
    default: () => Projects.default(),
    load: (data) => Projects.from(data),
  }),
  (store) => ({}),
);
