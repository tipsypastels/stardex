import { onCleanup } from "solid-js";
import { unsafeWipeEverythingAndReload } from "../../models/wipe";

export function Logo() {
  const onClick = createNthClickHandler(import.meta.env.DEV ? 3 : 15, () => {
    if (
      !confirm("Delete ALL your Stardex data? All projects, everything.") ||
      !confirm("Really? Last chance.")
    ) {
      return;
    }
    unsafeWipeEverythingAndReload();
  });

  return (
    <div
      title="Stardex"
      class="flex h-13.75 w-13.75 items-center justify-center rounded-md bg-primary text-3xl font-bold text-background shadow-xl shadow-shadow select-none"
      onClick={onClick}
    >
      <div>Sd</div>
    </div>
  );
}

function createNthClickHandler(max: number, f: () => void) {
  let count = 0;
  let timeout: number | undefined;

  onCleanup(() => clearTimeout(timeout));

  return () => {
    clearTimeout(timeout);

    if (count + 1 === max) {
      count = 0;
      f();
    } else {
      count++;
      timeout = setTimeout(() => (count = 0), 1000);
    }
  };
}
