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
      verbatimText: [[], {}],
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
      all: [{ v: 1, id: "x", species: "bulbasaur", comment: "hi" }],
      verbatimText: [[], {}],
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
        { v: 1, id: "y", species: "ivysaur", comment: "haha ivysuar" },
        { v: 1, id: "z", species: "venusaur" },
      ],
      verbatimText: [
        [""],
        {
          0: ["", "", "# hello, world", ""],
          2: [""],
        },
      ],
    });
  });

  test("textdiff entry with verbatim text buffering bug is accounted for", () => {
    expect(
      V1_upgradeRawPokemonList({
        v: 1,
        all: [
          { v: 1, species: "charmander", id: "lhnCpXEF" },
          { v: 1, species: "charmeleon", id: "mpXojvOc" },
          { v: 1, species: "charizard", id: "nenS7SZP" },
          { v: 1, species: "squirtle", id: "K0EpXxtP" },
          { v: 1, species: "wartortle", id: "sOBFneZr" },
          { v: 1, species: "blastoise", id: "55I65eCC" },
        ],
        textDiff: [
          "\u0000e2",
          "\u0000w# x",
          "\u0000e2",
          "\u0000b1",
          "# Water starters",
          "\u0000b1",
          "\u0000e3",
        ],
      }),
    ).toEqual({
      v: 2,
      all: [
        { v: 1, species: "charmander", id: "lhnCpXEF" },
        { v: 1, species: "charmeleon", id: "mpXojvOc" },
        { v: 1, species: "charizard", id: "nenS7SZP", comment: "x" },
        { v: 1, species: "squirtle", id: "K0EpXxtP" },
        { v: 1, species: "wartortle", id: "sOBFneZr" },
        { v: 1, species: "blastoise", id: "55I65eCC" },
      ],
      verbatimText: [[], { 2: ["", "# Water starters", ""] }],
    });
  });
});
