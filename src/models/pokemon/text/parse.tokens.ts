import { ExternalTokenizer } from "@lezer/lr";
import { FormName, Name } from "./parse.terms";

const AT = 64;
const LPAREN = 40;
const RPAREN = 41;
const HASH = 35;
const NL = 10;
const CR = 13;
const COLON = 58;
const SPACE = 32;
const TAB = 9;

function isNameStop(ch: number) {
  return (
    ch < 0 || ch === AT || ch === LPAREN || ch === RPAREN || ch === HASH || ch === NL || ch === CR
  );
}

function isSpace(ch: number) {
  return ch === SPACE || ch === TAB;
}

export const nameTokenizer = new ExternalTokenizer((input, stack) => {
  if (!stack.canShift(Name)) return;

  let len = 0;
  while (!isNameStop(input.peek(len))) len++;
  while (len > 0 && isSpace(input.peek(len - 1))) len--;
  if (len > 0) input.acceptToken(Name, len);
});

function looksLikeTypeList(codes: number[]) {
  const str = codes.map((c) => String.fromCharCode(c)).join("");
  if (str.trim().length === 0) return false;
  return str.split("/").every((part) => /^[ \t]*[A-Za-z0-9]+[ \t]*$/.test(part));
}

export const formNameTokenizer = new ExternalTokenizer((input) => {
  let len = 0;
  const codes = [];
  let sawColon = false;

  for (;;) {
    const ch = input.peek(len);
    if (ch < 0 || ch === NL || ch === CR || ch === HASH || ch === RPAREN) break;
    if (ch === COLON) {
      sawColon = true;
      break;
    }
    codes.push(ch);
    len++;
  }

  if (sawColon) {
    let trimmed = len;
    while (trimmed > 0 && isSpace(input.peek(trimmed - 1))) trimmed--;
    if (trimmed > 0) input.acceptToken(FormName, trimmed);
    return;
  }

  if (looksLikeTypeList(codes)) return;

  let trimmed = len;
  while (trimmed > 0 && isSpace(input.peek(trimmed - 1))) trimmed--;
  if (trimmed > 0) input.acceptToken(FormName, trimmed);
});
