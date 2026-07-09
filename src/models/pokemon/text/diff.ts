import { createModel, signal } from "@preact/signals";

/**
 * The format is:
 *  - \0e{count} for the next {count} entries without additional decoration.
 *  - \0b{count} for {count} blank lines.
 *  - All other lines are verbatim.
 */

export const PokemonListTextDiff = createModel(($raw: string | undefined) => {
  const raw = signal($raw);
  return { raw };
});

export class PokemonListTextDiffBuilder {
  #lines: string[] = [];
  #state?: { type: "entries"; count: number } | { type: "blanks"; count: number };

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

  verbatim(...lines: string[]) {
    this.#flush();
    this.#state = undefined;
    this.#lines.push(...lines);
    return this;
  }

  finish() {
    this.#flush();
    return this.#lines;
  }

  #flush() {
    if (this.#state?.type === "entries") {
      this.#lines.push(`\0e${this.#state.count}`);
    } else if (this.#state?.type === "blanks") {
      this.#lines.push(`\0b${this.#state.count}`);
    }
  }
}
