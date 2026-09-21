import type { Pokemon } from ".";
import {
  createTrivialPokemonListTextDiff,
  getPokemonListTextDiffVerbatimSuffixAt,
  setPokemonListTextDiffVerbatimSuffixAt,
  unsetPokemonListTextDiffVerbatimSuffixAt,
} from "./text/diff";

export interface PokemonCommenter {
  value: string | undefined;
  setValue(value: string): void;
  unsetValue(): void;
}

export function createPokemonCommenter(
  all: Pokemon[],
  getTextDiff: () => string[] | undefined,
  setTextDiff: (textDiff: string[] | undefined) => void,
  index: number,
): PokemonCommenter {
  return {
    get value() {
      const textDiff = getTextDiff();
      if (!textDiff) return;

      const suffix = getPokemonListTextDiffVerbatimSuffixAt(textDiff, index);
      if (!suffix) return;

      return verbatimSuffixToCommentValue(suffix);
    },

    setValue(value) {
      const textDiff = getTextDiff() ?? createTrivialPokemonListTextDiff(all.length);
      const suffix = commentValueToVerbatimSuffix(value);

      const newTextDiff = setPokemonListTextDiffVerbatimSuffixAt(textDiff, index, suffix);
      setTextDiff(newTextDiff);
    },

    unsetValue() {
      const textDiff = getTextDiff();
      if (!textDiff) return;

      const newTextDiff = unsetPokemonListTextDiffVerbatimSuffixAt(textDiff, index);
      setTextDiff(newTextDiff);
    },
  };
}

const COMMENT_START = /^\s*#\s*/;

function verbatimSuffixToCommentValue(suffix: string) {
  return suffix.replace(COMMENT_START, "");
}

function commentValueToVerbatimSuffix(value: string) {
  return value.match(COMMENT_START) ? value : `# ${value}`;
}
