import { describe, expect, test } from "vitest";
import type { RawPokemon } from "..";
import { serializePokemonListToText } from "./serialize";

describe(serializePokemonListToText, () => {
  function s(pokemons: RawPokemon[], textDiff?: string[], strict?: boolean) {
    return serializePokemonListToText({ pokemons, textDiff, strict });
  }

  test("empty", () => {
    expect(s([])).toEqual("");
  });

  test("single", () => {
    expect(s([{ v: 1, species: "bulbasaur" }])).toEqual("Bulbasaur");
  });

  test("multiple", () => {
    expect(
      s([
        { v: 1, species: "bulbasaur" },
        { v: 1, species: "ivysaur" },
        { v: 1, species: "venusaur" },
      ]),
    ).toEqual("Bulbasaur\nIvysaur\nVenusaur");
  });

  test("custom", () => {
    expect(s([{ v: 1, key: "foo", name: "Foo", types: ["flying"] }])).toEqual("Foo (Flying)");
  });

  test("custom types", () => {
    expect(s([{ v: 1, species: "bulbasaur", types: ["fire"] }])).toEqual("Bulbasaur (Fire)");
  });

  test("exclude", () => {
    expect(s([{ v: 1, species: "bulbasaur", exclude: true }])).toEqual("Bulbasaur @exclude");
    expect(s([{ v: 1, key: "foo", name: "Foo", types: ["flying"], exclude: true }])).toEqual(
      "Foo (Flying) @exclude",
    );
  });

  test("text diff", () => {
    expect(s([{ v: 1, species: "bulbasaur" }], ["\0b1", "\0e1"])).toEqual("\nBulbasaur");
    expect(s([{ v: 1, species: "bulbasaur" }], ["# Hello", "\0e1"])).toEqual("# Hello\nBulbasaur");

    expect(
      s(
        [
          { v: 1, species: "bulbasaur" },
          { v: 1, species: "ivysaur" },
          { v: 1, species: "venusaur" },
        ],
        ["# Best Starters", "\0e3", "\0b2"],
      ),
    ).toEqual("# Best Starters\nBulbasaur\nIvysaur\nVenusaur\n\n");
  });

  test("text diff being longer than list is ignored", () => {
    expect(s([{ v: 1, species: "bulbasaur" }], ["\0b1", "\0e2"])).toEqual("\nBulbasaur");
  });

  test("list being longer than text diff is ignored", () => {
    expect(
      s(
        [
          { v: 1, species: "bulbasaur" },
          { v: 1, species: "ivysaur" },
        ],
        ["\0b1", "\0e1"],
      ),
    ).toEqual("\nBulbasaur");
  });

  test("both of those can be made to throw", () => {
    expect(() => s([{ v: 1, species: "bulbasaur" }], ["\0b1", "\0e2"], true)).toThrow(
      new Error("Text diff entry count exceeded Pokemon list length"),
    );

    expect(() =>
      s(
        [
          { v: 1, species: "bulbasaur" },
          { v: 1, species: "ivysaur" },
        ],
        ["\0b1", "\0e1"],
        true,
      ),
    ).toThrow(new Error("Pokemon list length exceeded text diff entry count"));
  });

  test("except with a trivial diff, which is always ignored", () => {
    s([{ v: 1, species: "bulbasaur" }], [], true);
    s([{ v: 1, species: "bulbasaur" }], ["\0e2"], true);
  });
});
