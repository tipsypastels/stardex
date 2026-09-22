import { describe, expect, test } from "vitest";
import { deletePokemonListVerbatimTextEntry, RawPokemonListVerbatimTextBuilder } from "./verbatim";

describe(deletePokemonListVerbatimTextEntry, () => {
  test("moves entries after the deleted index down one", () => {
    expect(
      deletePokemonListVerbatimTextEntry(
        {
          beforeAll: ["zzz"],
          afterEntries: { 0: ["hi"], 2: ["bye"], 3: ["xd"] },
        },
        1,
      ),
    ).toEqual({
      beforeAll: ["zzz"],
      afterEntries: { 0: ["hi"], 1: ["bye"], 2: ["xd"] },
    });
  });

  test("merges onto lines that already have text", () => {
    expect(
      deletePokemonListVerbatimTextEntry(
        {
          beforeAll: ["zzz"],
          afterEntries: { 0: ["hi"], 1: ["bye"] },
        },
        1,
      ),
    ).toEqual({
      beforeAll: ["zzz"],
      afterEntries: { 0: ["hi", "bye"] },
    });
  });

  test("deleting the first entry moves its lines to beforeAll", () => {
    expect(
      deletePokemonListVerbatimTextEntry(
        {
          beforeAll: ["zzz"],
          afterEntries: { 0: ["hi"], 1: ["bye"] },
        },
        0,
      ),
    ).toEqual({
      beforeAll: ["zzz", "hi"],
      afterEntries: { 0: ["bye"] },
    });
  });
});

describe(RawPokemonListVerbatimTextBuilder, () => {
  const b = () => new RawPokemonListVerbatimTextBuilder();

  test("empty", () => {
    expect(b().finish()).toEqual({ beforeAll: [], afterEntries: [] });
  });

  test("verbatim before any entry goes to beforeAll", () => {
    expect(b().verbatim("x").finish()).toEqual({ beforeAll: ["x"], afterEntries: [] });
  });

  test("entry indices", () => {
    expect(
      b().verbatim("x").entry().verbatim("y").verbatim("z").entry().verbatim("za").finish(),
    ).toEqual({
      beforeAll: ["x"],
      afterEntries: [
        [0, ["y", "z"]],
        [1, ["za"]],
      ],
    });
  });

  test("does not output empty line arrays", () => {
    expect(b().entry().entry().verbatim("x").finish()).toEqual({
      beforeAll: [],
      afterEntries: [[1, ["x"]]],
    });
  });
});
