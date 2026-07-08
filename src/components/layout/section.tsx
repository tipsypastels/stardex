import { useSignal, useSignalEffect } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import type { ComponentChildren } from "preact";
import { stored } from "../../utils/storage";
import { ButtonIcon } from "../common/button_icon";

export interface SectionProps {
  id: string;
  title: string;
  children: ComponentChildren;
  hasActions?: boolean;
}

export function Section({ id, title, children, hasActions }: SectionProps) {
  const store = stored<boolean>(`stardex_section_${id}`);
  const open = useSignal(store.load() ?? true);

  useSignalEffect(() => {
    store.dump(open.value);
  });

  return (
    <section id={id} class="border-b-divider-light relative mb-8 border-b pb-8">
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
