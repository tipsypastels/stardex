import * as v from "valibot";

export const PLVT_BEFORE_ALL = 0;
export const PLVT_AFTER_ENTRIES = 1;

export type PokemonListVerbatimText = v.InferOutput<typeof PokemonListVerbatimText>;
export const PokemonListVerbatimText = v.tuple([
  v.array(v.string()),
  v.record(v.string(), v.array(v.string())),
]);

export function deletePokemonListVerbatimTextEntry(
  verbatimText: PokemonListVerbatimText,
  deleteIndex: number,
) {
  if (deleteIndex < 0) {
    return verbatimText;
  }

  const out: PokemonListVerbatimText = [verbatimText[PLVT_BEFORE_ALL], {}];

  for (const index_ in verbatimText[PLVT_AFTER_ENTRIES]) {
    const index = +index_;
    const lines = verbatimText[PLVT_AFTER_ENTRIES][index];

    if (index === 0 && deleteIndex === 0) {
      out[PLVT_BEFORE_ALL].push(...lines);
    } else if (index >= deleteIndex) {
      const movedIndex = index - 1;

      out[PLVT_AFTER_ENTRIES][movedIndex] ??= [];
      out[PLVT_AFTER_ENTRIES][movedIndex].push(...lines);
    } else {
      out[PLVT_AFTER_ENTRIES][index] = lines;
    }
  }

  return out;
}

export class PokemonListVerbatimTextBuilder {
  #beforeAll: string[] = [];
  #afterEntries: Record<string, string[]> = {};

  #currentEntry?: {
    index: number;
    lines: string[];
  };

  entry() {
    const oldIndex = this.#currentEntry?.index;

    this.#flushEntry();
    this.#currentEntry = { index: oldIndex == null ? 0 : oldIndex + 1, lines: [] };

    return this;
  }

  verbatim(line: string) {
    (this.#currentEntry?.lines ?? this.#beforeAll).push(line);
    return this;
  }

  finish(): PokemonListVerbatimText {
    this.#flushEntry();
    return [this.#beforeAll, this.#afterEntries];
  }

  #flushEntry() {
    if (this.#currentEntry && this.#currentEntry.lines.length > 0) {
      this.#afterEntries[this.#currentEntry.index] = this.#currentEntry.lines;
    }
    this.#currentEntry = undefined;
  }
}
