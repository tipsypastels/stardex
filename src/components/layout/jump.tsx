import { ReactiveMap } from "@solid-primitives/map";
import { batch, createEffect, createMemo } from "solid-js";
import { Icon } from "../common/icon";

export function MobileJump() {
  const state = createJumpState();

  createEffect(() => {
    const io = new IntersectionObserver((entries) => state.changed(entries), {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    for (const section of document.querySelectorAll("[data-section]")) {
      io.observe(section);
    }
  });

  function jumpTo(index: number) {
    const id = JUMP_IDS[index];
    const element = document.querySelector(`#${id}`) as HTMLElement;
    element.scrollIntoView({ behavior: "smooth" });
  }

  function jumpUp() {
    if (state.atStart) return;
    jumpTo(state.index - 1);
  }

  function jumpDown() {
    if (state.atEnd) return;
    jumpTo(state.index + 1);
  }

  return (
    <div class="fixed right-4 bottom-8 z-40 flex flex-col rounded-lg border-2 border-divider-heavy bg-background shadow-shadow">
      <button
        class="cursor-pointer p-4 pb-1 disabled:opacity-50"
        onClick={jumpUp}
        disabled={state.atStart}
      >
        <Icon name="angle-up" />
      </button>
      <button
        class="cursor-pointer p-4 pt-1 disabled:opacity-50"
        onClick={jumpDown}
        disabled={state.atEnd}
      >
        <Icon name="angle-down" />
      </button>
    </div>
  );
}

const JUMP_IDS = ["top", "pokedex", "types", "recommendations", "export"];

interface JumpSection {
  target: HTMLElement;
  ratio: number;
}

function createJumpState() {
  const all = new ReactiveMap<string, JumpSection>();
  const current = createMemo(() => [...all.values()].sort((a, b) => b.ratio - a.ratio)?.at(0));
  const index = createMemo(() => {
    const index = JUMP_IDS.findIndex((id) => id === current()?.target.id);
    return index === -1 ? 0 : index;
  });

  return {
    get index() {
      return index();
    },
    get atStart() {
      return index() === 0;
    },
    get atEnd() {
      return index() === JUMP_IDS.length - 1;
    },
    changed(entries: IntersectionObserverEntry[]) {
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
    },
  };
}
