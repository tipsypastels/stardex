import { useSignal, useSignalEffect } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import type { ComponentChildren } from "preact";
import { useRef } from "preact/hooks";
import { stored } from "../../utils/storage";
import { ButtonIcon } from "../common/button_icon";
import { useHotkey, type HotkeyInfoKey } from "./hotkeys";

export interface SectionProps {
  id: string;
  title: string;
  hotkey: HotkeyInfoKey;
  children: ComponentChildren;
  hasActions?: boolean;
}

export function Section({ id, title, hotkey, children, hasActions }: SectionProps) {
  const store = stored<boolean>(`stardex_section_${id}`);
  const open = useSignal(store.load() ?? true);
  const ref = useRef<HTMLDivElement>(null);

  useHotkey(hotkey, () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  });

  useSignalEffect(() => {
    store.dump(open.value);
  });

  return (
    <section id={id} class="relative mb-8 border-b border-b-divider-light pb-8" ref={ref}>
      <div class={`flex ${!open.value ? "" : hasActions ? "mb-4" : "mb-8"}`}>
        <h2 class="grow text-3xl select-none">{title}</h2>
        <div class="text-xl">
          <ButtonIcon
            icon={`angle-${open.value ? "down" : "up"}`}
            label={`Hide ${title}`}
            onClick={() => (open.value = !open.value)}
          />
        </div>
      </div>
      <Show when={open}>
        <div>{children}</div>
      </Show>
    </section>
  );
}
