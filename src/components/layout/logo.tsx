import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { unsafeWipeEverythingAndReload } from "../../state/wipe";

export function Logo() {
  const onClick = useNClicks(import.meta.env.DEV ? 3 : 15, () => {
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

function useNClicks(max: number, f: () => void) {
  const count = useSignal(0);
  const timeout = useRef<number>();

  useEffect(() => () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  });

  return () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    if (count.value + 1 === max) {
      count.value = 0;
      f();
    } else {
      count.value++;
      timeout.current = setTimeout(() => (count.value = 0), 1000);
    }
  };
}
