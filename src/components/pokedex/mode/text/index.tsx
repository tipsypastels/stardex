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
import { createEffect, onCleanup, onMount, Show, untrack } from "solid-js";
import type { PokedexModeViewProps } from "..";
import { pokemonsFiltered } from "../../../../models/pokedex/filter";
import { pokemons } from "../../../../models/pokemon/list";
import { serializePokemonListToText } from "../../../../models/pokemon/text/serialize";
import { projects } from "../../../../models/project/list";
import type { Spanned } from "../../../../utils/span";
import { clearPokedexModeRefreshCallback, setPokedexModeRefreshCallback } from "../refresh";
import { FilterNone } from "../util/filter_none";
import { autocomplete } from "./autocomplete";
import { filtering, formatLineNumbersWithFilteredLines } from "./filter";
import { inlayHints } from "./hints";
import { language } from "./language";
import { initialTrackingIds, trackingIds } from "./metadata";
import { parseInitial, parser } from "./parse";
import { highlightTheme, selectionMark, theme } from "./theme";
import { tooltip } from "./tooltip";
import { setZapperEnabled, zapper } from "./zapper";

export function PokedexTextView(props: PokedexModeViewProps) {
  let parent!: HTMLDivElement;
  let view: EditorView | undefined;

  onMount(() => {
    setPokedexModeRefreshCallback(() => {
      // eslint-disable-next-line no-console
      console.log("Text editor refreshing...");

      if (view) {
        view.setState(createState(props));
        parseInitial(view);
      }
    });
  });

  onCleanup(() => {
    clearPokedexModeRefreshCallback();
  });

  createEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    projects.activeId;
    view = new EditorView({ parent, state: createState(props) });

    parseInitial(view);
    onCleanup(() => view?.destroy());
  });

  createEffect(() => {
    if (!view) return;
    view.dispatch({ effects: setZapperEnabled.of(props.zapper) });
  });

  return (
    <>
      <div class="rounded-b-md border-2 border-t-0 border-secondary" ref={parent} />
      <Show when={pokemons.all.length > 0 && pokemonsFiltered.all.length === 0}>
        <FilterNone />
      </Show>
    </>
  );
}

function createState(props: PokedexModeViewProps) {
  const ids: Spanned<string>[] = [];
  const doc = untrack(() => serializePokemonListToText({ eachId: (id) => ids.push(id) }));

  const filter = filtering(
    untrack(() =>
      pokemonsFiltered.all.length < pokemons.all.length ? pokemonsFiltered.all : undefined,
    ),
  );

  return EditorState.create({
    doc,
    extensions: [
      minimalSetup,
      // From basicsetup
      bracketMatching(),
      closeBrackets(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      keymap.of([...closeBracketsKeymap, ...completionKeymap, ...lintKeymap, ...searchKeymap]),

      // From stardex
      lineNumbers({ formatNumber: formatLineNumbersWithFilteredLines }),
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
      filter,
      inlayHints,
      zapper(untrack(() => props.zapper)),
    ],
  });
}
