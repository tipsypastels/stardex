import { describe, expect, test } from "vitest";
import { parsePokemonListText } from "./parse";

describe(parsePokemonListText, () => {
  const p = parsePokemonListText;
  const pHeader = () => ({ v: 1, id: expect.any(String) });

  test("empty", () => {
    expect(p("")).toEqual({ pokemons: [], errors: [], textDiff: undefined });
  });

  test("single", () => {
    expect(p("charmander")).toEqual({
      pokemons: [{ ...pHeader(), species: "charmander" }],
      errors: [],
      textDiff: undefined,
    });
    expect(p("Charmander")).toEqual({
      pokemons: [{ ...pHeader(), species: "charmander" }],
      errors: [],
      textDiff: undefined,
    });
  });

  test("multiple", () => {
    expect(p("charmander\ncharmeleon\ncharizard")).toEqual({
      pokemons: [
        { ...pHeader(), species: "charmander" },
        { ...pHeader(), species: "charmeleon" },
        { ...pHeader(), species: "charizard" },
      ],
      errors: [],
      textDiff: undefined,
    });
  });

  test("blank lines", () => {
    expect(p("\n")).toEqual({ pokemons: [], errors: [], textDiff: ["\0b2"] });
    expect(p("\ncharmander")).toEqual({
      pokemons: [{ ...pHeader(), species: "charmander" }],
      errors: [],
      textDiff: ["\0b1", "\0e1"],
    });
    expect(p("charmander\n\ncharmeleon\n\ncharizard")).toEqual({
      pokemons: [
        { ...pHeader(), species: "charmander" },
        { ...pHeader(), species: "charmeleon" },
        { ...pHeader(), species: "charizard" },
      ],
      errors: [],
      textDiff: ["\0e1", "\0b1", "\0e1", "\0b1", "\0e1"],
    });
  });

  test("comments", () => {
    expect(p("# hello!\ncharmander")).toEqual({
      pokemons: [{ ...pHeader(), species: "charmander" }],
      errors: [],
      textDiff: ["# hello!", "\0e1"],
    });
  });

  test("trimming", () => {
    expect(p(" # hello!  \n   charmander  ")).toEqual({
      pokemons: [{ ...pHeader(), species: "charmander" }],
      errors: [],
      textDiff: ["# hello!", "\0e1"],
    });
  });

  test("exclude", () => {
    expect(p("charmander @exclude")).toEqual({
      pokemons: [{ ...pHeader(), species: "charmander", exclude: true }],
      errors: [],
      textDiff: undefined,
    });
    expect(p("charmander @ignore")).toEqual({
      pokemons: [{ ...pHeader(), species: "charmander", exclude: true }],
      errors: [],
      textDiff: undefined,
    });
  });

  test("types", () => {
    expect(p("charmander (water)")).toEqual({
      pokemons: [{ ...pHeader(), species: "charmander", types: ["water"] }],
      errors: [],
      textDiff: undefined,
    });
    expect(p("charmander (Water/Flying)")).toEqual({
      pokemons: [{ ...pHeader(), species: "charmander", types: ["water", "flying"] }],
      errors: [],
      textDiff: undefined,
    });
  });

  test("customs", () => {
    expect(p("foo (fire)")).toEqual({
      pokemons: [{ ...pHeader(), name: "foo", types: ["fire"] }],
      errors: [],
      textDiff: undefined,
    });
    expect(p("foo (fire/fantasy)")).toEqual({
      pokemons: [{ ...pHeader(), name: "foo", types: ["fire", "fantasy"] }],
      errors: [],
      textDiff: undefined,
    });
  });

  test("duplicates", () => {
    expect(p("charmander\ncharmander\ncharmander (water)")).toEqual({
      pokemons: [
        { ...pHeader(), species: "charmander" },
        { ...pHeader(), species: "charmander" },
        { ...pHeader(), species: "charmander", types: ["water"] },
      ],
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
        { ...pHeader(), species: "charmander", types: ["water"] },
        { ...pHeader(), species: "charmeleon", types: ["water"], exclude: true },
        { ...pHeader(), species: "charizard", types: ["water", "flying"] },
        { ...pHeader(), name: "foo", types: ["fire", "fantasy"], exclude: true },
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
        pokemons: [{ ...pHeader(), species: "charmander" }],
        errors: [error("UnimplementedLegacyModifier")],
        textDiff: undefined,
      });
      expect(p("charmander @filler")).toEqual({
        pokemons: [{ ...pHeader(), species: "charmander" }],
        errors: [error("UnimplementedLegacyModifier")],
        textDiff: undefined,
      });
    });

    test("unknown modifer", () => {
      expect(p("charmander @foo")).toEqual({
        pokemons: [{ ...pHeader(), species: "charmander" }],
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
