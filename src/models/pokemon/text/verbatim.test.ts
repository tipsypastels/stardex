import { describe, expect, test } from "vitest";
import { deletePokemonListVerbatimTextEntry } from "./verbatim";

describe(deletePokemonListVerbatimTextEntry, () => {
  test("moves entries after the deleted index down one", () => {
    expect(
      deletePokemonListVerbatimTextEntry(
        {
          beforeAll: ["zzz"],
          afterEntryIndices: { 0: ["hi"], 2: ["bye"], 3: ["xd"] },
        },
        1,
      ),
    ).toEqual({
      beforeAll: ["zzz"],
      afterEntryIndices: { 0: ["hi"], 1: ["bye"], 2: ["xd"] },
    });
  });

  test("merges onto lines that already have text", () => {
    expect(
      deletePokemonListVerbatimTextEntry(
        {
          beforeAll: ["zzz"],
          afterEntryIndices: { 0: ["hi"], 1: ["bye"] },
        },
        1,
      ),
    ).toEqual({
      beforeAll: ["zzz"],
      afterEntryIndices: { 0: ["hi", "bye"] },
    });
  });

  test("deleting the first entry moves its lines to beforeAll", () => {
    expect(
      deletePokemonListVerbatimTextEntry(
        {
          beforeAll: ["zzz"],
          afterEntryIndices: { 0: ["hi"], 1: ["bye"] },
        },
        0,
      ),
    ).toEqual({
      beforeAll: ["zzz", "hi"],
      afterEntryIndices: { 0: ["bye"] },
    });
  });
});
