import { createModel, signal } from "@preact/signals";
import { readonly } from "../../../utils/signal";

/**
 * The format is:
 *  - \0e{count} for the next {count} entries without additional decoration.
 *  - \0b{count} for {count} blank lines.
 *  - All other lines are verbatim.
 */

export const PokemonListTextDiff = createModel(($raw: string[] | undefined) => {
  if ($raw && pokemonListTextDiffIsTrivial($raw)) {
    $raw = undefined;
  }

  const raw = signal($raw);
  return {
    raw: readonly(raw),
    set(newRaw: string[] | undefined) {
      if (newRaw && pokemonListTextDiffIsTrivial(newRaw)) {
        newRaw = undefined;
      }
      raw.value = newRaw;
    },
  };
});

type DiffState =
  | { type: "entries"; count: number }
  | { type: "blanks"; count: number }
  | { type: "verbatim"; line: string };

export class PokemonListTextDiffBuilder {
  #lines: string[] = [];
  #state?: Exclude<DiffState, { type: "verbatim" }>;

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
