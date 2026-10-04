import { StateEffect } from "@codemirror/state";

// A hack to send a dummy transaction on initialization, called by parseInitial.
// This is only needed when an extension needs immediate access to the tree, when
// for some reason ensureSyntaxTree isn't enough.
//
// Used in:
//
//   - Inlay hints.
//
export const forceRefresh = StateEffect.define<void>();
