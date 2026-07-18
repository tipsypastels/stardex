import { createEffect, createSignal, Show, type JSXElement } from "solid-js";
import { stored } from "../../utils/storage";
import { ButtonIcon } from "../common/button";

export interface SectionProps {
  id: string;
  title: string;
  count?: number;
  children: JSXElement;
  hasActions?: boolean;
}

export function Section(props: SectionProps) {
  // We know ID is always static.
  // eslint-disable-next-line solid/reactivity
  const store = stored(`stardex_section_${props.id}`);
  const [open, setOpen] = createSignal(store.load() ?? true);

  createEffect(() => {
    store.dump(open());
  });

  return (
    <section data-section id={props.id} class="relative mb-8 border-b border-b-divider-light pb-8">
      <div class={`flex ${open() ? (props.hasActions ? "mb-4" : "mb-8") : ""}`}>
        <h2 class="grow text-3xl select-none">
          <span data-section-title>{props.title}</span>
          {props.count ? <sub class="text-lg text-foreground-lesser">{props.count}</sub> : null}
        </h2>
        <div class="text-xl">
          <ButtonIcon
            icon={`angle-${open() ? "down" : "up"}`}
            label={`Hide ${props.title}`}
            onClick={() => setOpen((open) => !open)}
          />
        </div>
      </div>
      <Show when={open()}>
        <div>{props.children}</div>
      </Show>
    </section>
  );
}
