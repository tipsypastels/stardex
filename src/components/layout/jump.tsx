import { ReactiveMap } from "@solid-primitives/map";
import scrollIntoView from "scroll-into-view-promise";
import { batch, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { Icon } from "../common/icon";

const JUMP_IDS = ["top", "pokedex", "types", "recommendations", "export"];
const OBSERVED_IDS = JUMP_IDS.slice(1);

export function Jump() {
  const state = createJumpState();

  return (
    <div class="fixed right-4 bottom-8 z-40 flex flex-col rounded-lg border-2 border-divider-heavy bg-background shadow-shadow">
      <button
        class="cursor-pointer p-4 pb-1 disabled:opacity-50"
        onClick={() => state.jumpBy(-1)}
        disabled={state.atStart}
      >
        <Icon name="angle-up" />
      </button>
      <button
        class="cursor-pointer p-4 pt-1 disabled:opacity-50"
        onClick={() => state.jumpBy(1)}
        disabled={state.atEnd}
      >
        <Icon name="angle-down" />
      </button>
    </div>
  );
}

interface JumpSection {
  target: HTMLElement;
  ratio: number;
}

function createJumpState() {
  const all = new ReactiveMap<string, JumpSection>();

  const [atTop, setAtPageTop] = createSignal(window.scrollY === 0);
  createEffect(() => {
    const onScroll = () => setAtPageTop(window.scrollY === 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  createEffect(() => {
    const io = new IntersectionObserver((entries) => changed(entries), {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    for (const id of OBSERVED_IDS) {
      const element = document.getElementById(id);
      if (element) io.observe(element);
    }
    onCleanup(() => io.disconnect());
  });

  const intersecting = createMemo(() => [...all.values()].sort((a, b) => b.ratio - a.ratio).at(0));
  const index = createMemo(() => {
    if (atTop()) return 0;
    const id = intersecting()?.target.id;
    const found = JUMP_IDS.findIndex((jumpId) => jumpId === id);
    return found === -1 ? 0 : found;
  });

  const [queue, setQueue] = createSignal<number[]>([]);
  let processing = false;
  let disposed = false;
  onCleanup(() => {
    disposed = true;
  });

  const effectiveIndex = createMemo(() => queue().at(-1) ?? index());

  async function processQueue() {
    if (processing) {
      return;
    }

    processing = true;

    while (queue().length > 0 && !disposed) {
      const target = queue()[0];
      const id = JUMP_IDS[target];
      const element = document.getElementById(id);
      if (element) {
        try {
          await scrollIntoView(element, { behavior: "smooth" });
        } catch {
          // element removed or scroll interrupted, do nothing
        }
      }

      if (disposed) {
        break;
      }

      setQueue((queue) => queue.slice(1));
    }

    processing = false;
  }

  function changed(entries: IntersectionObserverEntry[]) {
    batch(() => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          all.set(entry.target.id, {
            target: entry.target as HTMLElement,
            ratio: entry.intersectionRatio,
          });
        } else {
          all.delete(entry.target.id);
        }
      }
    });
  }

  return {
    get atStart() {
      return effectiveIndex() === 0;
    },
    get atEnd() {
      return effectiveIndex() === JUMP_IDS.length - 1;
    },
    jumpBy(offset: number) {
      const base = effectiveIndex();
      const target = Math.max(0, Math.min(JUMP_IDS.length - 1, base + offset));
      if (target === base && queue().length === 0) {
        return; // already there, nothing queued
      }

      setQueue((queue) => [...queue, target]);
      processQueue();
    },
  };
}
