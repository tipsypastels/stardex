import { EditorState, Facet, StateField, type Extension } from "@codemirror/state";
import { Decoration, EditorView, type DecorationSet } from "@codemirror/view";
import type { Pokemon } from "../../../../models/pokemon";
import type { Span } from "../../../../utils/span";
import { getAllTrackedIds } from "./metadata";

type IdSet = Set<string>;

export function filtering(pokemons: Pokemon[] | undefined): Extension {
  const idSet = pokemons && new Set(pokemons.map((pokemon) => pokemon.id));

  return [
    initialFilter.of(idSet),
    filterState,
    hiddenLines,

    EditorState.readOnly.from(filterState, (f) => f != null),
    EditorView.editable.from(filterState, (f) => f == null),
  ];
}

const initialFilter = Facet.define<IdSet | undefined, IdSet | undefined>({
  combine: (sets) => sets.at(-1),
});

const filterState = StateField.define<IdSet | undefined>({
  create: (state) => state.facet(initialFilter),
  // We don't need to handle updates because afterActionChange
  // recreates the editor state when setting a filter.
  update: (set) => set,
});

const hiddenLines = StateField.define<DecorationSet>({
  create: decorateHiddenLines,
  update: (set) => set,
  provide: (field) => EditorView.decorations.from(field),
});

function decorateHiddenLines(state: EditorState) {
  const idSet = state.field(filterState);
  if (!idSet) return Decoration.none;

  const trackedIds = getAllTrackedIds(state);
  const hiddenLineNumbers: number[] = [];

  let pokemonIndex = 0;

  for (let lineNo = 1; lineNo <= state.doc.lines; lineNo++) {
    const line = state.doc.line(lineNo);

    // Catch up with any skipped non-tracked lines.
    while (pokemonIndex < trackedIds.length && trackedIds[pokemonIndex].to < line.from) {
      pokemonIndex++;
    }

    const trackedId = trackedIds[pokemonIndex];
    const isTrackedLine = trackedId && trackedId.from <= line.from && line.to <= trackedId.to;
    const visible = isTrackedLine && idSet.has(trackedId.value);

    if (!visible) {
      hiddenLineNumbers.push(lineNo);
    }
  }

  const hiddenSpans: Span[] = [];

  // Groups consecutive hidden lines. Hidden lines attach BACKWARDS,
  // consuming the newline of the non-hidden line before. This is needed
  // or else codemirror will get the line numbers wrong.
  let i = 0;
  while (i < hiddenLineNumbers.length) {
    let j = i;

    while (
      j + 1 < hiddenLineNumbers.length &&
      hiddenLineNumbers[j + 1] === hiddenLineNumbers[j] + 1
    ) {
      j++;
    }

    const firstLine = state.doc.line(hiddenLineNumbers[i]);
    const lastLine = state.doc.line(hiddenLineNumbers[j]);

    if (firstLine.number === 1) {
      hiddenSpans.push({ from: firstLine.from, to: Math.min(lastLine.to + 1, state.doc.length) });
    } else {
      hiddenSpans.push({ from: firstLine.from - 1, to: lastLine.to });
    }

    i = j + 1;
  }

  return Decoration.set(
    hiddenSpans.map((span) => Decoration.replace({}).range(span.from, span.to)),
  );
}
