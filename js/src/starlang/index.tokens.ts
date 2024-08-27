import { ExternalTokenizer } from "@lezer/lr";
import { emptyLineStart } from "./index.grammar.terms";

const NEWLINE = 10;
const SPACE = 32;
const TAB = 9;
const HASH = 35;
const EOF = -1;

export const emptyLineTokens = new ExternalTokenizer((input, stack) => {
  const prev = input.peek(-1);

  if (prev !== EOF && prev !== NEWLINE) {
    return;
  }

  while (input.next === SPACE || input.next === TAB) {
    input.advance();
  }

  if (
    (input.next === NEWLINE || input.next === HASH) &&
    stack.canShift(emptyLineStart)
  ) {
    input.acceptToken(emptyLineStart);
  }
});
