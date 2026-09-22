import { describe, expect, test } from "vitest";
import { V1_upgradeRawPokemonList } from "./v1";

describe(V1_upgradeRawPokemonList, () => {
  test("empty", () => {
    expect(
      V1_upgradeRawPokemonList({
        v: 1,
        all: [],
        textDiff: [],
      }),
    ).toEqual({
      v: 2,
      all: [],
      verbatimText: { beforeAll: [], afterEntries: [] },
    });
  });

  test("inline comments", () => {
    expect(
      V1_upgradeRawPokemonList({
        v: 1,
        all: [{ v: 1, id: "x", species: "bulbasaur" }],
        textDiff: ["\0w# hi"],
      }),
    ).toEqual({
      v: 2,
      all: [{ v: 1, id: "x", species: "bulbasaur", inlineComment: "hi" }],
      verbatimText: { beforeAll: [], afterEntries: [] },
    });
  });

  test("typical case", () => {
    expect(
      V1_upgradeRawPokemonList({
        v: 1,
        all: [
          { v: 1, id: "x", species: "bulbasaur" },
          { v: 1, id: "y", species: "ivysaur" },
          { v: 1, id: "z", species: "venusaur" },
        ],
        // prettier-ignore
        textDiff: [
          "\0b1",
          "\0e1",
          "\0b2",
          "# hello, world",
          "\0b1",
          "\0w# haha ivysuar",
          "\0e1",
          "\0b1"
        ],
      }),
    ).toEqual({
      v: 2,
      all: [
        { v: 1, id: "x", species: "bulbasaur" },
        { v: 1, id: "y", species: "ivysaur", inlineComment: "haha ivysuar" },
        { v: 1, id: "z", species: "venusaur" },
      ],
      verbatimText: {
        beforeAll: [""],
        afterEntries: [
          [0, ["", "", "# hello, world", ""]],
          [2, [""]],
        ],
      },
    });
  });
});
