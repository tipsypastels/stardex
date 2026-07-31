import { dropDb } from "./database";

export function unsafeWipeEverythingAndReload() {
  localStorage.clear();
  dropDb(() => location.reload());
}
