import * as v from "valibot";

export type RawPokemonListVerbatimText = v.InferOutput<typeof RawPokemonListVerbatimText>;
export const RawPokemonListVerbatimText = v.object({
  beforeAll: v.array(v.string()),
  afterEntryIndices: v.array(v.tuple([v.number(), v.array(v.string())])),
});

export interface PokemonListVerbatimText {
  beforeAll: string[];
  afterEntryIndices: Record<number, string[]>;
}

export function pokemonListVerbatimTextFromRaw(
  raw: RawPokemonListVerbatimText,
): PokemonListVerbatimText {
  return {
    beforeAll: raw.beforeAll,
    afterEntryIndices: Object.fromEntries(raw.afterEntryIndices.map(([i, v]) => [i, v])),
  };
}

export function pokemonListVerbatimTextToRaw(
  verbatimText: PokemonListVerbatimText,
): RawPokemonListVerbatimText {
  return {
    beforeAll: verbatimText.beforeAll,
    afterEntryIndices: Object.entries(verbatimText.afterEntryIndices).map(([i, v]) => [+i, v]),
  };
}

export function deletePokemonListVerbatimTextEntry(
  verbatimText: PokemonListVerbatimText,
  deleteIndex: number,
) {
  const out: PokemonListVerbatimText = {
    beforeAll: verbatimText.beforeAll,
    afterEntryIndices: {},
  };

  for (const index_ in verbatimText.afterEntryIndices) {
    const index = +index_;
    const lines = verbatimText.afterEntryIndices[index];

    if (index === 0 && deleteIndex === 0) {
      out.beforeAll.push(...lines);
    } else if (index >= deleteIndex) {
      const movedIndex = index - 1;

      out.afterEntryIndices[movedIndex] ??= [];
      out.afterEntryIndices[movedIndex].push(...lines);
    } else {
      out.afterEntryIndices[index] = lines;
    }
  }

  return out;
}

export class PokemonListVerbatimTextBuilder {
  #beforeEntryIndices: Record<number, string[]> = {};
  #entryIndex = 0;
  #verbatimLines: string[] = [];

  entry() {
    if (this.#verbatimLines.length > 0) {
      this.#beforeEntryIndices[this.#entryIndex] = this.#verbatimLines;
      this.#verbatimLines = [];
    }
    this.#entryIndex++;
    return this;
  }

  verbatim(line: string) {
    this.#verbatimLines.push(line);
    return this;
  }

  finish(): PokemonListVerbatimText {
    return {
      afterEntryIndices: this.#beforeEntryIndices,
      beforeAll: this.#verbatimLines,
    };
  }
}
