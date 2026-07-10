import { describe, expect, test } from "vitest";
import { parsePokemonListText } from "./parse";

describe(parsePokemonListText, () => {
  const p = parsePokemonListText;

  test("empty", () => {
    expect(p("")).toEqual({ pokemons: { v: 1, all: [], textDiff: undefined }, errors: [] });
  });

  test("single", () => {
    expect(p("charmander")).toEqual({
      pokemons: { v: 1, all: [{ v: 1, species: "charmander" }], textDiff: undefined },
      errors: [],
    });
    expect(p("Charmander")).toEqual({
      pokemons: { v: 1, all: [{ v: 1, species: "charmander" }], textDiff: undefined },
      errors: [],
    });
  });

  test("multiple", () => {
    expect(p("charmander\ncharmeleon\ncharizard")).toEqual({
      pokemons: {
        v: 1,
        all: [
          { v: 1, species: "charmander" },
          { v: 1, species: "charmeleon" },
          { v: 1, species: "charizard" },
        ],
        textDiff: undefined,
      },
      errors: [],
    });
  });

  test("blank lines", () => {
    expect(p("\n")).toEqual({
      pokemons: { v: 1, all: [], textDiff: ["\0b2"] },
      errors: [],
    });
    expect(p("\ncharmander")).toEqual({
      pokemons: { v: 1, all: [{ v: 1, species: "charmander" }], textDiff: ["\0b1", "\0e1"] },
      errors: [],
    });
    expect(p("charmander\n\ncharmeleon\n\ncharizard")).toEqual({
      pokemons: {
        v: 1,
        all: [
          { v: 1, species: "charmander" },
          { v: 1, species: "charmeleon" },
          { v: 1, species: "charizard" },
        ],
        textDiff: ["\0e1", "\0b1", "\0e1", "\0b1", "\0e1"],
      },
      errors: [],
    });
  });

  test("comments", () => {
    expect(p("# hello!\ncharmander")).toEqual({
      pokemons: { v: 1, all: [{ v: 1, species: "charmander" }], textDiff: ["# hello!", "\0e1"] },
      errors: [],
    });
  });

  test("trimming", () => {
    expect(p(" # hello!  \n   charmander  ")).toEqual({
      pokemons: { v: 1, all: [{ v: 1, species: "charmander" }], textDiff: ["# hello!", "\0e1"] },
      errors: [],
    });
  });

  test("exclude", () => {
    expect(p("charmander @exclude")).toEqual({
      pokemons: {
        v: 1,
        all: [{ v: 1, species: "charmander", exclude: true }],
        textDiff: undefined,
      },
      errors: [],
    });
    expect(p("charmander @ignore")).toEqual({
      pokemons: {
        v: 1,
        all: [{ v: 1, species: "charmander", exclude: true }],
        textDiff: undefined,
      },
      errors: [],
    });
  });

  test("types", () => {
    expect(p("charmander (water)")).toEqual({
      pokemons: {
        v: 1,
        all: [{ v: 1, species: "charmander", types: ["water"] }],
        textDiff: undefined,
      },
      errors: [],
    });
    expect(p("charmander (Water/Flying)")).toEqual({
      pokemons: {
        v: 1,
        all: [{ v: 1, species: "charmander", types: ["water", "flying"] }],
        textDiff: undefined,
      },
      errors: [],
    });
  });

  test("customs", () => {
    expect(p("foo (fire)")).toEqual({
      pokemons: {
        v: 1,
        all: [{ v: 1, key: "foo", name: "foo", types: ["fire"] }],
        textDiff: undefined,
      },
      errors: [],
    });
    expect(p("foo (fire/fantasy)")).toEqual({
      pokemons: {
        v: 1,
        all: [{ v: 1, key: "foo", name: "foo", types: ["fire", "fantasy"] }],
        textDiff: undefined,
      },
      errors: [],
    });
  });

  test("everything", () => {
    expect(
      p(
        "# the gauntlet:\ncharmander (water)\ncharmeleon (water) @exclude\ncharizard (water/flying)\n\nfoo @exclude (fire/fantasy)",
      ),
    ).toEqual({
      pokemons: {
        v: 1,
        all: [
          { v: 1, species: "charmander", types: ["water"] },
          { v: 1, species: "charmeleon", types: ["water"], exclude: true },
          { v: 1, species: "charizard", types: ["water", "flying"] },
          { v: 1, key: "foo", name: "foo", types: ["fire", "fantasy"], exclude: true },
        ],
        textDiff: ["# the gauntlet:", "\0e3", "\0b1", "\0e1"],
      },
      errors: [],
    });
  });

  describe("errors", () => {
    const error = (kind: string) => expect.objectContaining({ kind });

    test("custom missing types", () => {
      expect(p("foo")).toEqual({
        pokemons: { v: 1, all: [], textDiff: ["foo"] },
        errors: [error("CustomMissingTypes")],
      });
    });

    test("unimplemented legacy modifier", () => {
      expect(p("charmander @alt")).toEqual({
        pokemons: { v: 1, all: [{ v: 1, species: "charmander" }], textDiff: undefined },
        errors: [error("UnimplementedLegacyModifier")],
      });
      expect(p("charmander @filler")).toEqual({
        pokemons: { v: 1, all: [{ v: 1, species: "charmander" }], textDiff: undefined },
        errors: [error("UnimplementedLegacyModifier")],
      });
    });

    test("unknown modifer", () => {
      expect(p("charmander @foo")).toEqual({
        pokemons: { v: 1, all: [{ v: 1, species: "charmander" }], textDiff: undefined },
        errors: [error("UnknownModifier")],
      });
    });

    test("empty type list", () => {
      expect(p("charmander ()")).toEqual({
        pokemons: { v: 1, all: [], textDiff: ["charmander ()"] },
        errors: [error("EmptyTypeList")],
      });
      expect(p("foo ()")).toEqual({
        pokemons: { v: 1, all: [], textDiff: ["foo ()"] },
        errors: [error("EmptyTypeList")],
      });
    });
  });
});
