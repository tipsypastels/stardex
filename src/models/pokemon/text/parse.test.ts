import { describe, expect, test } from "vitest";
import { parsePokemonListText } from "./parse";

describe(parsePokemonListText, () => {
  const p = parsePokemonListText;

  test("empty", () => {
    expect(p("")).toEqual({ pokemons: [], errors: [], textDiff: undefined });
  });

  test("single", () => {
    expect(p("charmander")).toEqual({
      pokemons: [{ v: 1, species: "charmander" }],
      errors: [],
      textDiff: undefined,
    });
    expect(p("Charmander")).toEqual({
      pokemons: [{ v: 1, species: "charmander" }],
      errors: [],
      textDiff: undefined,
    });
  });

  test("multiple", () => {
    expect(p("charmander\ncharmeleon\ncharizard")).toEqual({
      pokemons: [
        { v: 1, species: "charmander" },
        { v: 1, species: "charmeleon" },
        { v: 1, species: "charizard" },
      ],
      errors: [],
      textDiff: undefined,
    });
  });

  test("blank lines", () => {
    expect(p("\n")).toEqual({ pokemons: [], errors: [], textDiff: ["\0b2"] });
    expect(p("\ncharmander")).toEqual({
      pokemons: [{ v: 1, species: "charmander" }],
      errors: [],
      textDiff: ["\0b1", "\0e1"],
    });
    expect(p("charmander\n\ncharmeleon\n\ncharizard")).toEqual({
      pokemons: [
        { v: 1, species: "charmander" },
        { v: 1, species: "charmeleon" },
        { v: 1, species: "charizard" },
      ],
      errors: [],
      textDiff: ["\0e1", "\0b1", "\0e1", "\0b1", "\0e1"],
    });
  });

  test("comments", () => {
    expect(p("# hello!\ncharmander")).toEqual({
      pokemons: [{ v: 1, species: "charmander" }],
      errors: [],
      textDiff: ["# hello!", "\0e1"],
    });
  });

  test("trimming", () => {
    expect(p(" # hello!  \n   charmander  ")).toEqual({
      pokemons: [{ v: 1, species: "charmander" }],
      errors: [],
      textDiff: ["# hello!", "\0e1"],
    });
  });

  test("exclude", () => {
    expect(p("charmander @exclude")).toEqual({
      pokemons: [{ v: 1, species: "charmander", exclude: true }],
      errors: [],
      textDiff: undefined,
    });
    expect(p("charmander @ignore")).toEqual({
      pokemons: [{ v: 1, species: "charmander", exclude: true }],
      errors: [],
      textDiff: undefined,
    });
  });

  test("types", () => {
    expect(p("charmander (water)")).toEqual({
      pokemons: [{ v: 1, species: "charmander", types: ["water"] }],
      errors: [],
      textDiff: undefined,
    });
    expect(p("charmander (Water/Flying)")).toEqual({
      pokemons: [{ v: 1, species: "charmander", types: ["water", "flying"] }],
      errors: [],
      textDiff: undefined,
    });
  });

  test("customs", () => {
    expect(p("foo (fire)")).toEqual({
      pokemons: [{ v: 1, key: "foo", name: "foo", types: ["fire"] }],
      errors: [],
      textDiff: undefined,
    });
    expect(p("foo (fire/fantasy)")).toEqual({
      pokemons: [{ v: 1, key: "foo", name: "foo", types: ["fire", "fantasy"] }],
      errors: [],
      textDiff: undefined,
    });
  });

  test("everything", () => {
    expect(
      p(
        "# the gauntlet:\ncharmander (water)\ncharmeleon (water) @exclude\ncharizard (water/flying)\n\nfoo @exclude (fire/fantasy)",
      ),
    ).toEqual({
      pokemons: [
        { v: 1, species: "charmander", types: ["water"] },
        { v: 1, species: "charmeleon", types: ["water"], exclude: true },
        { v: 1, species: "charizard", types: ["water", "flying"] },
        { v: 1, key: "foo", name: "foo", types: ["fire", "fantasy"], exclude: true },
      ],
      errors: [],
      textDiff: ["# the gauntlet:", "\0e3", "\0b1", "\0e1"],
    });
  });

  describe("errors", () => {
    const error = (kind: string) => expect.objectContaining({ kind });

    test("custom missing types", () => {
      expect(p("foo")).toEqual({
        pokemons: [],
        errors: [error("CustomMissingTypes")],
        textDiff: ["foo"],
      });
    });

    test("unimplemented legacy modifier", () => {
      expect(p("charmander @alt")).toEqual({
        pokemons: [{ v: 1, species: "charmander" }],
        errors: [error("UnimplementedLegacyModifier")],
        textDiff: undefined,
      });
      expect(p("charmander @filler")).toEqual({
        pokemons: [{ v: 1, species: "charmander" }],
        errors: [error("UnimplementedLegacyModifier")],
        textDiff: undefined,
      });
    });

    test("unknown modifer", () => {
      expect(p("charmander @foo")).toEqual({
        pokemons: [{ v: 1, species: "charmander" }],
        errors: [error("UnknownModifier")],
        textDiff: undefined,
      });
    });

    test("empty type list", () => {
      expect(p("charmander ()")).toEqual({
        pokemons: [],
        errors: [error("EmptyTypeList")],
        textDiff: ["charmander ()"],
      });
      expect(p("foo ()")).toEqual({
        pokemons: [],
        errors: [error("EmptyTypeList")],
        textDiff: ["foo ()"],
      });
    });
  });
});
