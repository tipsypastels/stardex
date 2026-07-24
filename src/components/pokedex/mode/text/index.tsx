import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { bracketMatching } from "@codemirror/language";
import { lintKeymap } from "@codemirror/lint";
import { searchKeymap } from "@codemirror/search";
import {
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  placeholder,
} from "@codemirror/view";
import { EditorView, minimalSetup } from "codemirror";
import { createEffect, onCleanup, untrack } from "solid-js";
import { serializePokemonListToText } from "../../../../models/pokemon/text/serialize";
import { projects } from "../../../../models/project/list";
import type { Spanned } from "../../../../utils/span";
import { PokedexHelp } from "../../help";
import { createCachedHeightTracker } from "./height";
import { autocompleteAddToOptions, language } from "./language";
import { initialTrackingIds, trackingIds } from "./metadata";
import { parseInitial, parser } from "./parse";
import { highlightTheme, selectionMark, theme } from "./theme";

export function PokedexTextView() {
  let parent!: HTMLDivElement;

  createEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    projects.activeId;

    const ids: Spanned<string>[] = [];
    const doc = untrack(() => serializePokemonListToText({ eachId: (id) => ids.push(id) }));

    const view = new EditorView({
      doc,
      parent,
      extensions: [
        minimalSetup,
        // From basicsetup
        lineNumbers(),
        bracketMatching(),
        closeBrackets(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        keymap.of([...closeBracketsKeymap, ...completionKeymap, ...lintKeymap, ...searchKeymap]),

        // From basicsetup, customized
        autocompletion({
          addToOptions: autocompleteAddToOptions,
        }),

        // From stardex
        placeholder("Enter some Pokémon, one per line..."),
        theme,
        selectionMark,
        highlightTheme,

        language,
        trackingIds,
        initialTrackingIds.of(ids),
        parser,
      ],
    });

    parseInitial(view.state);
    onCleanup(() => view.destroy());
  });

  createCachedHeightTracker(() => parent);

  return (
    <>
      <div class="rounded-b-md border-2 border-t-0 border-secondary" ref={parent} />
      <PokedexHelp />
    </>
  );
}
