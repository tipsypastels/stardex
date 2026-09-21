import { must } from "../../../utils/assert";

type DiffState =
  | { type: "entries"; count: number }
  | { type: "blanks"; count: number }
  | { type: "entry-with-verbatim-suffix"; suffix: string }
  | { type: "verbatim"; line: string };

export class PokemonListTextDiffBuilder {
  #lines: string[] = [];
  #state?: DiffState & { type: "entries" | "blanks" };

  entry() {
    if (this.#state?.type === "entries") {
      this.#state.count++;
    } else {
      this.#flush();
      this.#state = { type: "entries", count: 1 };
    }
    return this;
  }

  blank(n: number) {
    if (this.#state?.type === "blanks") {
      this.#state.count += n;
    } else {
      this.#flush();
      this.#state = { type: "blanks", count: n };
    }
    return this;
  }

  entryWithVerbatimSuffix(suffix: string) {
    this.#flush();
    this.#state = undefined;
    this.#lines.push(`\0w${suffix}`);
    return this;
  }

  verbatim(...lines: string[]) {
    this.#flush();
    this.#state = undefined;
    this.#lines.push(...lines);
    return this;
  }

  finish() {
    this.#flush();
    if (!pokemonListTextDiffIsTrivial(this.#lines)) {
      return this.#lines;
    }
  }

  #flush() {
    if (this.#state?.type === "entries") {
      this.#lines.push(`\0e${this.#state.count}`);
    } else if (this.#state?.type === "blanks") {
      this.#lines.push(`\0b${this.#state.count}`);
    }
  }
}

export function* readPokemonListTextDiff(textDiff: string[]): Generator<DiffState> {
  for (const line of textDiff) {
    if (line.startsWith("\0e")) {
      const count = +line.slice(2);
      yield { type: "entries", count };
    } else if (line.startsWith("\0b")) {
      const count = +line.slice(2);
      yield { type: "blanks", count };
    } else if (line.startsWith("\0w")) {
      const suffix = line.slice(2);
      yield { type: "entry-with-verbatim-suffix", suffix };
    } else {
      yield { type: "verbatim", line };
    }
  }
}

export function pokemonListTextDiffIsTrivial(textDiff: string[]) {
  return (
    textDiff.length === 0 ||
    (textDiff.length === 1 && (textDiff[0].startsWith("\0e") || textDiff[0] === "\0b1"))
  );
}

export function createTrivialPokemonListTextDiff(entryCount: number) {
  return [`\0e${entryCount}`];
}

export function getPokemonListTextDiffVerbatimSuffixAt(textDiff: string[], index: number) {
  const entry = locateEntry(textDiff, index);
  if (entry?.type === "entry-with-verbatim-suffix") return entry.suffix;
}

export function setPokemonListTextDiffVerbatimSuffixAt(
  textDiff: string[],
  index: number,
  suffix: string,
) {
  const entry = must(locateEntry(textDiff, index), `No entry at index ${index} of text diff.`);

  switch (entry.type) {
    case "entry-in-run": {
      const replacedEntries: string[] = [];

      const splitCountBefore = entry.runOffset;
      const splitCountAfter = entry.runSize - entry.runOffset - 1;

      if (splitCountBefore > 0) {
        replacedEntries.push(`\0e${splitCountBefore}`);
      }

      replacedEntries.push(`\0w${suffix}`);

      if (splitCountAfter > 0) {
        replacedEntries.push(`\0e${splitCountAfter}`);
      }

      const newTextDiff = [...textDiff];

      newTextDiff.splice(entry.diffIndex, 1, ...replacedEntries);
      return newTextDiff;
    }
    case "entry-with-verbatim-suffix": {
      const newTextDiff = [...textDiff];
      newTextDiff[entry.diffIndex] = `\0w${suffix}`;
      return newTextDiff;
    }
  }
}

export function unsetPokemonListTextDiffVerbatimSuffixAt(textDiff: string[], index: number) {
  const entry = must(locateEntry(textDiff, index), `No entry at index ${index} of text diff.`);

  switch (entry.type) {
    case "entry-in-run": {
      return textDiff;
    }
    case "entry-with-verbatim-suffix": {
      const diffBefore = textDiff.slice(0, entry.diffIndex);
      const diffAfter = textDiff.slice(entry.diffIndex + 1);

      const lastBefore = diffBefore.at(-1);
      const firstAfter = diffAfter.at(0);

      let mergedRunCount = 1;

      if (lastBefore && lastBefore.startsWith("\0e")) {
        mergedRunCount += +lastBefore.slice(2);
        diffBefore.pop();
      }
      if (firstAfter && firstAfter.startsWith("\0e")) {
        mergedRunCount += +firstAfter.slice(2);
        diffAfter.shift();
      }

      return [...diffBefore, `\0e${mergedRunCount}`, ...diffAfter];
    }
  }
}

type LocatedEntry =
  | { type: "entry-in-run"; diffIndex: number; runSize: number; runOffset: number }
  | { type: "entry-with-verbatim-suffix"; diffIndex: number; suffix: string };

function locateEntry(textDiff: string[], index: number): LocatedEntry | undefined {
  let seenCount = 0;

  for (let diffIndex = 0; diffIndex < textDiff.length; diffIndex++) {
    const line = textDiff[diffIndex];
    if (line.startsWith("\0e")) {
      const runSize = +line.slice(2);
      if (index < seenCount + runSize) {
        return { type: "entry-in-run", diffIndex, runSize, runOffset: index - seenCount };
      }
      seenCount += runSize;
    } else if (line.startsWith("\0w")) {
      if (index === seenCount) {
        const suffix = line.slice(2);
        return { type: "entry-with-verbatim-suffix", diffIndex, suffix };
      }
      seenCount += 1;
    }
  }
}
