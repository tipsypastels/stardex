import * as v from "valibot";
import { V0_RawBuiltinPokemon, V0_RawCustomPokemon, V0_upgradeRawPokemon } from "../pokemon/v0";
import type { V1_RawPokemon } from "../pokemon/v1";
import type { V1_RawPokemonList } from "./v1";

/**
 * Pokemon List V0:
 *  - No explicit version.
 *  - Was an array.
 *  - No notion of textDiff.
 */

export const V0_RawPokemonList = v.array(v.union([V0_RawBuiltinPokemon, V0_RawCustomPokemon]));

export function V0_upgradeRawPokemonList(
  raws: v.InferOutput<typeof V0_RawPokemonList>,
): v.InferOutput<typeof V1_RawPokemonList> {
  const all: v.InferOutput<typeof V1_RawPokemon>[] = [];
  const textDiffBuilder = new TextDiffBuilder();

  for (const raw of raws) {
    all.push(V0_upgradeRawPokemon(raw));

    if (raw.newlinesBefore) {
      textDiffBuilder.blank(raw.newlinesBefore);
    }
    if (raw.comment) {
      textDiffBuilder.verbatim(...raw.comment.split("\n").map((c) => `# ${c}`));
    }
    textDiffBuilder.entry();
  }

  const lastRaw = raws.at(-1);
  if (lastRaw?.newlinesAfterIfLast) {
    textDiffBuilder.blank(lastRaw.newlinesAfterIfLast);
  }

  const textDiff = textDiffBuilder.finish();
  return { v: 1, all, textDiff };
}

export class TextDiffBuilder {
  #lines: string[] = [];
  #state?: { type: "entries" | "blanks"; count: number };

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
