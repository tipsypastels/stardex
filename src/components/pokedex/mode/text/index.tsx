import { basicSetup, EditorView } from "codemirror";
import { createEffect, onCleanup, untrack } from "solid-js";
import { pokemons } from "../../../../models/pokemon/list";
import { projects } from "../../../../models/project/list";
import type { Spanned } from "../../../../utils/span";
import { language } from "./language";
import { initialTrackingIds, trackingIds } from "./metadata";
import { parseInitial, parser } from "./parse";
import { highlightTheme, theme } from "./theme";

export function PokedexTextView() {
  let parent!: HTMLDivElement;

  createEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    projects.activeId;

    const ids: Spanned<string>[] = [];
    const doc = untrack(() => pokemons.toSerializedText((id) => ids.push(id)));

    const view = new EditorView({
      doc,
      parent,
      extensions: [
        basicSetup,
        theme,
        language,
        trackingIds,
        initialTrackingIds.of(ids),
        highlightTheme,
        parser,
      ],
    });

    parseInitial(view.state);
    onCleanup(() => view.destroy());
  });

  return <div class="rounded-b-md border-2 border-t-0 border-secondary" ref={parent} />;
}
