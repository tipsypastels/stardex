import { ExternalTokenizer } from "@lezer/lr";
import { AltName, Comment, InlineComment, Name } from "./index.terms";

/* --------------------------------- Sigils --------------------------------- */

const AT = 64;
const LPAREN = 40;
const RPAREN = 41;
const HASH = 35;
const NL = 10;
const CR = 13;
const COLON = 58;
const SPACE = 32;
const TAB = 9;

/* -------------------------------------------------------------------------- */
/*                                    Name                                    */
/* -------------------------------------------------------------------------- */

export const nameTokenizer = new ExternalTokenizer((input, stack) => {
  if (!stack.canShift(Name)) return;
  if (isSpace(input.peek(0))) return;

  let len = 0;
  while (!isNameStop(input.peek(len))) len++;
  while (len > 0 && isSpace(input.peek(len - 1))) len--;
  if (len > 0) input.acceptToken(Name, len);
});

function isNameStop(ch: number) {
  return (
    ch < 0 || ch === AT || ch === LPAREN || ch === RPAREN || ch === HASH || ch === NL || ch === CR
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Spec                                    */
/* -------------------------------------------------------------------------- */

export const altNameTokenizer = new ExternalTokenizer((input, stack) => {
  if (!stack.canShift(AltName)) return;
  if (isSpace(input.peek(0))) return;

  let len = 0;
  const chars = [];
  let sawColon = false;

  for (;;) {
    const ch = input.peek(len);
    if (ch < 0 || ch === NL || ch === CR || ch === HASH || ch === RPAREN) break;
    if (ch === COLON) {
      sawColon = true;
      break;
    }
    chars.push(ch);
    len++;
  }

  if (sawColon) {
    let trimmed = len;
    while (trimmed > 0 && isSpace(input.peek(trimmed - 1))) trimmed--;
    if (trimmed > 0) input.acceptToken(AltName, trimmed);
    return;
  }

  if (isTypeList(chars)) return;

  let trimmed = len;
  while (trimmed > 0 && isSpace(input.peek(trimmed - 1))) trimmed--;
  if (trimmed > 0) input.acceptToken(AltName, trimmed);
});

function isTypeList(chars: number[]) {
  const str = chars.map((c) => String.fromCharCode(c)).join("");
  if (str.trim().length === 0) return false;
  return str.split("/").every((part) => /^[ \t]*[A-Za-z0-9]+[ \t]*$/.test(part));
}

/* -------------------------------------------------------------------------- */
/*                         Comments & Inline Comments                         */
/* -------------------------------------------------------------------------- */

export const commentTokenizer = new ExternalTokenizer((input, stack) => {
  if (input.peek(0) !== HASH) return;

  let back = -1;
  while (isSpace(input.peek(back))) back--;
  const prevCh = input.peek(back);
  const startOfLine = prevCh < 0 || isNewline(prevCh);

  let len = 0;
  while (input.peek(len) >= 0 && !isNewline(input.peek(len))) len++;

  let trimmed = len;
  while (trimmed > 0 && isSpace(input.peek(trimmed - 1))) trimmed--;

  if (startOfLine) {
    if (stack.canShift(Comment)) input.acceptToken(Comment, trimmed);
  } else {
    if (stack.canShift(InlineComment)) input.acceptToken(InlineComment, trimmed);
  }
});

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function isSpace(ch: number) {
  return ch === SPACE || ch === TAB;
}

function isNewline(ch: number) {
  return ch === NL || ch === CR;
}
