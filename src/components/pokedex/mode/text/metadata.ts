import { syntaxTree } from "@codemirror/language";
import {
  EditorState,
  Facet,
  Range,
  RangeSet,
  RangeValue,
  StateField,
  Transaction,
} from "@codemirror/state";
import { id as makeId } from "../../../../utils/id";
import type { Span, Spanned } from "../../../../utils/span";

export const trackingIds = StateField.define<RangeSet<TrackedId>>({
  create(state) {
    const seeds = state.facet(initialTrackingIds);
    const seedSet = RangeSet.of(
      seeds.map(({ value, from, to }) => new TrackedId(value).range(from, to)),
      true,
    );
    return reconcile(state, seedSet);
  },
  update(value, tr) {
    if (tr.docChanged && tr.isUserEvent("move.line")) {
      return handleLineSwap(value, tr);
    }

    let mapped = value.map(tr.changes);
    if (tr.docChanged) {
      mapped = reconcile(tr.state, mapped);
    }

    return mapped;
  },
});

export const initialTrackingIds = Facet.define<Spanned<string>[], Spanned<string>[]>({
  combine: (arrays) => arrays.at(-1) ?? [],
});

export function getTrackedIdAtSpan(state: EditorState, span: Span) {
  const set = state.field(trackingIds);
  let id: string | undefined;

  set.between(span.from, span.to, (_from, _to, value) => {
    id = value.id;
  });

  return id;
}

export function getAllTrackedIds(state: EditorState): Spanned<string>[] {
  const out: Spanned<string>[] = [];

  state.field(trackingIds).between(0, state.doc.length, (from, to, value) => {
    out.push({ value: value.id, from, to });
  });

  return out;
}

class TrackedId extends RangeValue {
  point = false;

  readonly id: string;

  constructor(id = makeId()) {
    super();
    this.id = id;
  }

  eq(other: RangeValue) {
    return other instanceof TrackedId && other.id === this.id;
  }
}

function reconcile(state: EditorState, mapped: RangeSet<TrackedId>): RangeSet<TrackedId> {
  const newRanges = computeSpans(state);
  const claimed = new Set<TrackedId>();
  const out: Range<TrackedId>[] = [];

  for (const { from, to } of newRanges) {
    let reused: TrackedId | undefined;

    mapped.between(from, to, (_f, _t, value) => {
      if (!reused && !claimed.has(value)) {
        reused = value;
      }
    });

    const id = reused ?? new TrackedId();
    claimed.add(id);
    out.push(id.range(from, to));
  }

  return RangeSet.of(out, true);
}

function handleLineSwap(old: RangeSet<TrackedId>, tr: Transaction): RangeSet<TrackedId> {
  let fromA = Infinity;
  let toA = -Infinity;

  tr.changes.iterChangedRanges((f, t) => {
    fromA = Math.min(fromA, f);
    toA = Math.max(toA, t);
  });

  if (fromA === Infinity) {
    return old.map(tr.changes);
  }

  const oldLines: { id: TrackedId; text: string }[] = [];
  old.between(fromA, toA, (from, _to, value) => {
    oldLines.push({ id: value, text: tr.startState.doc.lineAt(from).text });
  });

  const claimed = new Set(oldLines.map((l) => l.id));
  const untouched: Range<TrackedId>[] = [];
  old.between(0, tr.startState.doc.length, (from, to, value) => {
    if (!claimed.has(value)) {
      untouched.push(value.range(from, to));
    }
  });

  const result = RangeSet.of(untouched, true).map(tr.changes);
  const newFrom = tr.changes.mapPos(fromA, -1);
  const newTo = tr.changes.mapPos(toA, 1);
  const newListings = computeSpans(tr.state).filter((nl) => nl.from >= newFrom && nl.to <= newTo);

  const queueByText = new Map<string, TrackedId[]>();
  for (const { id, text } of oldLines) {
    const q = queueByText.get(text) ?? [];
    q.push(id);
    queueByText.set(text, q);
  }

  const toAdd: Range<TrackedId>[] = [];
  for (const nl of newListings) {
    const text = tr.state.doc.sliceString(nl.from, nl.to);
    const q = queueByText.get(text);
    const id = q && q.length ? q.shift()! : new TrackedId();
    toAdd.push(id.range(nl.from, nl.to));
  }

  return result.update({ add: toAdd, sort: true });
}

function computeSpans(state: EditorState): Span[] {
  const tree = syntaxTree(state);
  const ranges: Span[] = [];

  for (const listing of tree.topNode.getChildren("Listing")) {
    const line = state.doc.lineAt(listing.from);
    ranges.push({ from: line.from, to: line.to });
  }

  return ranges;
}
