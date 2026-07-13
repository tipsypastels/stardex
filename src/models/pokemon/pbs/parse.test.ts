import fs from "node:fs";
import { describe, expect, test } from "vitest";
import { parsePBSFile } from "./parse";

describe(parsePBSFile, () => {
  const p = parsePBSFile;

  function expectSampleToMatchAllPokemon(name: string) {
    const pokemons = p(fs.readFileSync(`${__dirname}/${name}`, "utf-8"));

    for (const pokemon of pokemons) {
      expect(pokemon).toEqual({
        v: 1,
        species: expect.stringMatching(/^[a-z0-9-]+$/),
      });
    }
  }

  test("sample", () => {
    expectSampleToMatchAllPokemon("sample.txt");
  });

  test("sample gen 9", () => {
    expectSampleToMatchAllPokemon("sample_gen9.txt");
  });

  test("empty", () => {
    expect(p("")).toEqual([]);
  });

  test("basic", () => {
    expect(p("[BULBASAUR]\nName=Bulbasaur\nTypes=GRASS,POISON")).toEqual([
      { v: 1, species: "bulbasaur" },
    ]);
  });

  test("spacing", () => {
    expect(p("  [ BULBASAUR  ]\n Name =  Bulbasaur \nTypes=GRASS , POISON ")).toEqual([
      { v: 1, species: "bulbasaur" },
    ]);
  });

  test("comments", () => {
    expect(p("# foo\n[BULBASAUR]")).toEqual([{ v: 1, species: "bulbasaur" }]);
    expect(p("[FOO] #foo\nName=Bar #baz\nTypes=NORMAL")).toEqual([
      { v: 1, key: "bar", name: "Bar", types: ["normal"] },
    ]);
  });

  test("invalid lines are ignored", () => {
    expect(p("xd")).toEqual([]);
    expect(p("[BULBASAUR]\nxd")).toEqual([{ v: 1, species: "bulbasaur" }]);
  });

  test("name can be omitted if it's just capitalize(id)", () => {
    expect(p("[BULBASAUR]\nTypes=GRASS,POISON")).toEqual([{ v: 1, species: "bulbasaur" }]);
    expect(p("[FOO]\nTypes=NORMAL")).toEqual([
      { v: 1, key: "foo", name: "Foo", types: ["normal"] },
    ]);
    expect(p("[MRMIME]\nTypes=PSYCHIC")).toEqual([
      { v: 1, key: "mrmime", name: "Mrmime", types: ["psychic"] },
    ]);
  });

  test("builtin pokemon can omit types", () => {
    expect(p("[BULBASAUR]\nName=Bulbasaur")).toEqual([{ v: 1, species: "bulbasaur" }]);
    expect(p("[BULBASAUR]")).toEqual([{ v: 1, species: "bulbasaur" }]);
  });

  test("multiple omitting everything", () => {
    expect(p("[BULBASAUR]\n[IVYSAUR]")).toEqual([
      { v: 1, species: "bulbasaur" },
      { v: 1, species: "ivysaur" },
    ]);
  });

  test("missing section at start is an error", () => {
    expect(() => p("Name=Bulbasaur")).toThrow(
      expect.objectContaining({
        message: "Expected a section at the start of the file, e.g. [BULBASAUR]",
        lineIndex: 0,
      }),
    );
  });

  test("custom pokemon missing types is an error", () => {
    expect(() => p("[FOO]")).toThrow(
      expect.objectContaining({
        errors: [
          expect.objectContaining({ message: "Pokémon [FOO] is missing Types=", lineIndex: 0 }),
        ],
      }),
    );
    expect(() => p("[FOO]\nName=Bar")).toThrow(
      expect.objectContaining({
        errors: [
          expect.objectContaining({ message: "Pokémon [FOO] is missing Types=", lineIndex: 0 }),
        ],
      }),
    );
  });
});
