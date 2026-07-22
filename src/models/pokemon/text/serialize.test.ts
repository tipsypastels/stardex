import { describe, expect, test } from "vitest";
import type { RawPokemon } from "..";
import { id } from "../../../utils/id";
import { serializeRawPokemonListToText } from "./serialize";

describe(serializeRawPokemonListToText, () => {
  const header = () => ({ v: 1 as const, id: id() });

  function s(pokemons: RawPokemon[], textDiff?: string[], strict?: boolean) {
    return serializeRawPokemonListToText({ pokemons, textDiff, strict });
  }

  test("empty", () => {
    expect(s([])).toEqual("");
  });

  test("single", () => {
    expect(s([{ ...header(), species: "bulbasaur" }])).toEqual("Bulbasaur");
  });

  test("multiple", () => {
    expect(
      s([
        { ...header(), species: "bulbasaur" },
        { ...header(), species: "ivysaur" },
        { ...header(), species: "venusaur" },
      ]),
    ).toEqual("Bulbasaur\nIvysaur\nVenusaur");
  });

  test("custom", () => {
    expect(s([{ ...header(), name: "Foo", types: ["flying"] }])).toEqual("Foo (Flying)");
  });

  test("custom types", () => {
    expect(s([{ ...header(), species: "bulbasaur", types: ["fire"] }])).toEqual("Bulbasaur (Fire)");
  });

  test("alt names", () => {
    expect(s([{ ...header(), species: "bulbasaur", customAltName: "mega" }])).toEqual(
      "Bulbasaur (Mega:)",
    );
    expect(s([{ ...header(), name: "Foo", altName: "mega z", types: ["fire", "normal"] }])).toEqual(
      "Foo (Mega Z:Fire/Normal)",
    );
  });

  test("exclude", () => {
    expect(s([{ ...header(), species: "bulbasaur", exclude: true }])).toEqual("Bulbasaur @exclude");
    expect(s([{ ...header(), name: "Foo", types: ["flying"], exclude: true }])).toEqual(
      "Foo (Flying) @exclude",
    );
  });

  test("text diff", () => {
    expect(s([{ ...header(), species: "bulbasaur" }], ["\0b1", "\0e1"])).toEqual("\nBulbasaur");
    expect(s([{ ...header(), species: "bulbasaur" }], ["# Hello", "\0e1"])).toEqual(
      "# Hello\nBulbasaur",
    );

    expect(
      s(
        [
          { ...header(), species: "bulbasaur" },
          { ...header(), species: "ivysaur" },
          { ...header(), species: "venusaur" },
        ],
        ["# Best Starters", "\0e3", "\0b2"],
      ),
    ).toEqual("# Best Starters\nBulbasaur\nIvysaur\nVenusaur\n\n");
  });

  test("text diff being longer than list is ignored", () => {
    expect(s([{ ...header(), species: "bulbasaur" }], ["\0b1", "\0e2"])).toEqual("\nBulbasaur");
  });

  test("list being longer than text diff is ignored", () => {
    expect(
      s(
        [
          { ...header(), species: "bulbasaur" },
          { ...header(), species: "ivysaur" },
        ],
        ["\0b1", "\0e1"],
      ),
    ).toEqual("\nBulbasaur");
  });

  test("both of those can be made to throw", () => {
    expect(() => s([{ ...header(), species: "bulbasaur" }], ["\0b1", "\0e2"], true)).toThrow(
      new Error("Text diff entry count exceeded Pokemon list length"),
    );

    expect(() =>
      s(
        [
          { ...header(), species: "bulbasaur" },
          { ...header(), species: "ivysaur" },
        ],
        ["\0b1", "\0e1"],
        true,
      ),
    ).toThrow(new Error("Pokemon list length exceeded text diff entry count"));
  });

  test("except with a trivial diff, which is always ignored", () => {
    s([{ ...header(), species: "bulbasaur" }], [], true);
    s([{ ...header(), species: "bulbasaur" }], ["\0e2"], true);
  });

  test("disambiguating the known alt type hack", () => {
    expect(
      s([
        { ...header(), species: "calyrex", types: ["ice"] },
        { ...header(), species: "calyrex", types: ["shadow"] },
      ]),
    ).toEqual("Calyrex (:Ice)\nCalyrex (:Shadow)");
  });
});
