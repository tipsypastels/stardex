import { computed, createModel, signal, useModel } from "@preact/signals";
import { Map as IMap } from "immutable";
import { useEffect } from "preact/hooks";
import { Icon } from "../common/icon";

export function MobileJump() {
  const state = useModel(JumpState);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => state.changed(entries), {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    for (const section of document.querySelectorAll("[data-section]")) {
      io.observe(section);
    }
  }, []);

  function jumpTo(index: number) {
    const id = SECTION_IDS[index];
    const element = document.querySelector(`#${id}`) as HTMLElement;
    element.scrollIntoView({ behavior: "smooth" });
  }

  function jumpUp() {
    if (state.atStart.value) return;
    jumpTo(state.index.value - 1);
  }

  function jumpDown() {
    if (state.atEnd.value) return;
    jumpTo(state.index.value + 1);
  }

  return (
    <div class="fixed right-4 bottom-8 z-40 flex flex-col rounded-lg border-2 border-divider-heavy bg-background shadow-shadow md:hidden">
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

const SECTION_IDS = ["pokedex", "types", "recommendations", "export"];

interface JumpSection {
  target: HTMLElement;
  ratio: number;
}

const JumpState = createModel(() => {
  const all = signal(IMap<string, JumpSection>());
  const current = computed(() => [...all.value.values()].sort((a, b) => b.ratio - a.ratio)?.at(0));
  const index = computed(() => {
    const index = SECTION_IDS.findIndex((id) => id === current?.value?.target.id);
    return index === -1 ? 0 : index;
  });

  const atStart = computed(() => index.value === 0);
  const atEnd = computed(() => index.value === SECTION_IDS.length - 1);

  return {
    index,
    atStart,
    atEnd,
    changed(entries: IntersectionObserverEntry[]) {
      all.value = all.value.withMutations((map) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            map.set(entry.target.id, {
              target: entry.target as HTMLElement,
              ratio: entry.intersectionRatio,
            });
          } else {
            map.remove(entry.target.id);
          }
        }
      });
    },
  };
});
