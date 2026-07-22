import { syntaxTree } from "@codemirror/language";
import { EditorState, Range, RangeSet, RangeValue, StateField } from "@codemirror/state";
import { id as makeId } from "../../../../utils/id";
import type { Span, Spanned } from "../../../../utils/span";

export const trackingIds = StateField.define<RangeSet<TrackedId>>({
  create(state) {
    return reconcile(state, RangeSet.empty);
  },
  update(value, tr) {
    let mapped = value.map(tr.changes);
    if (tr.docChanged) {
      mapped = reconcile(tr.state, mapped);
    }
    return mapped;
  },
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

  constructor(id: string) {
    super();
    this.id = id;
  }

  eq(other: RangeValue) {
    return other instanceof TrackedId && other.id === this.id;
  }
}

function reconcile(state: EditorState, mapped: RangeSet<TrackedId>): RangeSet<TrackedId> {
  const newRanges = computeListingRanges(state);
  const claimed = new Set<TrackedId>();
  const out: Range<TrackedId>[] = [];

  for (const { from, to } of newRanges) {
    let reused: TrackedId | undefined;

    mapped.between(from, to, (_f, _t, value) => {
      if (!reused && !claimed.has(value)) {
        reused = value;
      }
    });

    const id = reused ?? new TrackedId(makeId());
    claimed.add(id);
    out.push(id.range(from, to));
  }

  return RangeSet.of(out, true);
}

function computeListingRanges(state: EditorState): Span[] {
  const tree = syntaxTree(state);
  const ranges: { from: number; to: number }[] = [];

  for (const listing of tree.topNode.getChildren("Listing")) {
    const line = state.doc.lineAt(listing.from);
    ranges.push({ from: line.from, to: line.to });
  }

  return ranges;
}
