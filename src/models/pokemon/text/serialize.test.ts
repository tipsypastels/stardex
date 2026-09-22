import { describe, expect, test } from "vitest";
import type { RawPokemon } from "..";
import { makeId } from "../../../utils/id";
import { serializeRawPokemonListToText } from "./serialize";
import type { PokemonListVerbatimText } from "./verbatim";

describe(serializeRawPokemonListToText, () => {
  const header = () => ({ v: 1 as const, id: makeId() });

  function s(pokemons: RawPokemon[], verbatimText?: PokemonListVerbatimText) {
    return serializeRawPokemonListToText({ pokemons, verbatimText });
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

  test("verbatim text", () => {
    expect(s([{ ...header(), species: "bulbasaur" }], [[""], {}])).toEqual("\nBulbasaur");
    expect(s([{ ...header(), species: "bulbasaur" }], [["# Hello"], {}])).toEqual(
      "# Hello\nBulbasaur",
    );

    expect(
      s(
        [
          { ...header(), species: "bulbasaur" },
          { ...header(), species: "ivysaur" },
          { ...header(), species: "venusaur" },
        ],
        [["# Best Starters"], { 2: ["", ""] }],
      ),
    ).toEqual("# Best Starters\nBulbasaur\nIvysaur\nVenusaur\n\n");
  });

  test("verbatim text after entries out of range is ignored", () => {
    expect(s([{ ...header(), species: "bulbasaur" }], [[], { 1: ["xd"] }])).toEqual("Bulbasaur");
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
