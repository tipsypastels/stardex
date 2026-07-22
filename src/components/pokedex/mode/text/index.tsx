import { basicSetup, EditorView } from "codemirror";
import { createEffect, onCleanup, untrack } from "solid-js";
import { pokemons } from "../../../../models/pokemon/list";
import { projects } from "../../../../models/project/list";
import { language } from "./language";
import { trackingIds } from "./metadata";
import { parser } from "./parse";
import { highlightTheme, theme } from "./theme";

export function PokedexTextView() {
  let parent!: HTMLDivElement;

  createEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    projects.activeId;

    // TODO: Set IDs.
    const doc = untrack(() => pokemons.toSerializedText());
    const view = new EditorView({
      doc,
      parent,
      extensions: [basicSetup, theme, language, trackingIds, highlightTheme, parser],
    });

    onCleanup(() => view.destroy());
  });

  return <div class="rounded-b-md border-2 border-t-0 border-secondary" ref={parent} />;
}
