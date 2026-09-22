import * as v from "valibot";

export type RawPokemonListVerbatimText = v.InferOutput<typeof RawPokemonListVerbatimText>;
export const RawPokemonListVerbatimText = v.object({
  beforeAll: v.array(v.string()),
  afterEntries: v.array(v.tuple([v.number(), v.array(v.string())])),
});

export interface PokemonListVerbatimText {
  beforeAll: string[];
  afterEntries: Record<number, string[]>;
}

export function pokemonListVerbatimTextFromRaw(
  raw: RawPokemonListVerbatimText,
): PokemonListVerbatimText {
  return {
    beforeAll: raw.beforeAll,
    afterEntries: Object.fromEntries(raw.afterEntries.map(([i, v]) => [i, v])),
  };
}

export function pokemonListVerbatimTextToRaw(
  verbatimText: PokemonListVerbatimText,
): RawPokemonListVerbatimText {
  return {
    beforeAll: verbatimText.beforeAll,
    afterEntries: Object.entries(verbatimText.afterEntries).map(([i, v]) => [+i, v]),
  };
}

export function deletePokemonListVerbatimTextEntry(
  verbatimText: PokemonListVerbatimText,
  deleteIndex: number,
) {
  const out: PokemonListVerbatimText = {
    beforeAll: verbatimText.beforeAll,
    afterEntries: {},
  };

  for (const index_ in verbatimText.afterEntries) {
    const index = +index_;
    const lines = verbatimText.afterEntries[index];

    if (index === 0 && deleteIndex === 0) {
      out.beforeAll.push(...lines);
    } else if (index >= deleteIndex) {
      const movedIndex = index - 1;

      out.afterEntries[movedIndex] ??= [];
      out.afterEntries[movedIndex].push(...lines);
    } else {
      out.afterEntries[index] = lines;
    }
  }

  return out;
}

abstract class BuilderImpl<FinishedAfterEntries> {
  #beforeAll: string[] = [];
  #afterEntries: Record<number, string[]> = {};

  #currentEntry?: {
    index: number;
    lines: string[];
  };

  protected abstract finishAfterEntries(
    afterEntries: Record<number, string[]>,
  ): FinishedAfterEntries;

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

  finish() {
    this.#flushEntry();
    return {
      beforeAll: this.#beforeAll,
      afterEntries: this.finishAfterEntries(this.#afterEntries),
    };
  }

  #flushEntry() {
    if (this.#currentEntry && this.#currentEntry.lines.length > 0) {
      this.#afterEntries[this.#currentEntry.index] = this.#currentEntry.lines;
    }
    this.#currentEntry = undefined;
  }
}

export class PokemonListVerbatimTextBuilder extends BuilderImpl<Record<number, string[]>> {
  protected finishAfterEntries(afterEntries: Record<number, string[]>) {
    return afterEntries;
  }
}

export class RawPokemonListVerbatimTextBuilder extends BuilderImpl<[number, string[]][]> {
  protected finishAfterEntries(afterEntries: Record<number, string[]>) {
    return Object.entries(afterEntries).map(([i, v]) => [+i, v] as [number, string[]]);
  }
}
