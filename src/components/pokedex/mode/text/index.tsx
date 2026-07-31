import { closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { bracketMatching } from "@codemirror/language";
import { lintKeymap } from "@codemirror/lint";
import { searchKeymap } from "@codemirror/search";
import { EditorState } from "@codemirror/state";
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
import { PokedexEmpty } from "../../empty";
import { autocomplete } from "./autocomplete";
import { language } from "./language";
import { initialTrackingIds, trackingIds } from "./metadata";
import { parseInitial, parser } from "./parse";
import { highlightTheme, selectionMark, theme } from "./theme";
import { tooltip } from "./tooltip";

export function PokedexTextView() {
  let parent!: HTMLDivElement;
  let view: EditorView | undefined;

  createEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    projects.activeId;
    view = new EditorView({ parent, state: createState() });

    parseInitial(view.state);
    onCleanup(() => view?.destroy());
  });

  return (
    <>
      <div class="rounded-b-md border-2 border-t-0 border-secondary" ref={parent} />
      <PokedexEmpty
        afterImport={() => {
          if (view) {
            view.setState(createState());
          }
        }}
      />
    </>
  );
}

function createState() {
  const ids: Spanned<string>[] = [];
  const doc = untrack(() => serializePokemonListToText({ eachId: (id) => ids.push(id) }));
  return EditorState.create({
    doc,
    extensions: [
      minimalSetup,
      // From basicsetup
      lineNumbers(),
      bracketMatching(),
      closeBrackets(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      keymap.of([...closeBracketsKeymap, ...completionKeymap, ...lintKeymap, ...searchKeymap]),

      // From stardex
      placeholder("Enter some Pokémon, one per line..."),
      theme,
      selectionMark,
      highlightTheme,

      language,
      trackingIds,
      initialTrackingIds.of(ids),
      parser,
      autocomplete,
      tooltip,
    ],
  });
}
