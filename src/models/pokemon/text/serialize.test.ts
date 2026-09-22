import { describe, expect, test } from "vitest";
import type { RawPokemon } from "..";
import { makeId } from "../../../utils/id";
import type { Spanned } from "../../../utils/span";
import { serializeRawPokemonListToText } from "./serialize";
import type { PokemonListVerbatimText } from "./verbatim";

describe(serializeRawPokemonListToText, () => {
  const header = () => ({ v: 1 as const, id: makeId() });

  function s(
    pokemons: RawPokemon[],
    verbatimText?: PokemonListVerbatimText,
    eachId?: (id: Spanned<string>) => void,
  ) {
    return serializeRawPokemonListToText({ pokemons, verbatimText, eachId });
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

  test("id span tracking", () => {
    const spans: Spanned<string>[] = [];

    expect(
      s(
        [
          { v: 1, id: "a", species: "bulbasaur" },
          { v: 1, id: "b", species: "ivysaur" },
          { v: 1, id: "c", species: "venusaur" },
          { v: 1, id: "d", species: "charmander" },
          { v: 1, id: "e", species: "charmeleon" },
          { v: 1, id: "f", species: "charizard" },
        ],
        [["", ""], { 2: ["", "# Fire", ""] }],
        (span) => spans.push(span),
      ),
    ).toEqual(`\n\nBulbasaur\nIvysaur\nVenusaur\n\n# Fire\n\nCharmander\nCharmeleon\nCharizard`);

    expect(spans).toEqual([
      { value: "a", from: 2, to: 11 },
      { value: "b", from: 12, to: 19 },
      { value: "c", from: 20, to: 28 },
      { value: "d", from: 38, to: 48 },
      { value: "e", from: 49, to: 59 },
      { value: "f", from: 60, to: 69 },
    ] satisfies Spanned<string>[]);
  });
});
