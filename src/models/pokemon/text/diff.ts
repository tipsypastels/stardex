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
