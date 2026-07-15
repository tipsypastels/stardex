import fs from "node:fs";
import { describe, expect, test } from "vitest";
import { parsePBSFiles } from "./parse";

describe(parsePBSFiles, () => {
  const p = (...texts: string[]) =>
    parsePBSFiles(texts.map((t, i) => ({ text: t, name: `f${i}` })));

  const header = () => ({ v: 1, id: expect.any(String) });

  function expectSampleToMatchAllPokemon(name: string) {
    const pokemons = p(fs.readFileSync(`samples/pbs/${name}`, "utf-8"));

    for (const pokemon of pokemons) {
      expect(pokemon).toEqual({
        ...header(),
        species: expect.stringMatching(/^[a-z0-9-]+$/),
      });
    }
  }

  test("sample", () => {
    expectSampleToMatchAllPokemon("base.txt");
  });

  test("sample gen 9", () => {
    expectSampleToMatchAllPokemon("base_gen9.txt");
  });

  test("empty", () => {
    expect(p("")).toEqual([]);
  });

  test("basic", () => {
    expect(p("[BULBASAUR]\nName=Bulbasaur\nTypes=GRASS,POISON")).toEqual([
      { ...header(), species: "bulbasaur" },
    ]);
  });

  test("spacing", () => {
    expect(p("  [ BULBASAUR  ]\n Name =  Bulbasaur \nTypes=GRASS , POISON ")).toEqual([
      { ...header(), species: "bulbasaur" },
    ]);
  });

  test("comments", () => {
    expect(p("# foo\n[BULBASAUR]")).toEqual([{ ...header(), species: "bulbasaur" }]);
    expect(p("[FOO] #foo\nName=Bar #baz\nTypes=NORMAL")).toEqual([
      { ...header(), name: "Bar", types: ["normal"] },
    ]);
  });

  test("invalid lines are ignored", () => {
    expect(p("xd")).toEqual([]);
    expect(p("[BULBASAUR]\nxd")).toEqual([{ ...header(), species: "bulbasaur" }]);
  });

  test("name can be omitted if it's just capitalize(id)", () => {
    expect(p("[BULBASAUR]\nTypes=GRASS,POISON")).toEqual([{ ...header(), species: "bulbasaur" }]);
    expect(p("[FOO]\nTypes=NORMAL")).toEqual([{ ...header(), name: "Foo", types: ["normal"] }]);
    expect(p("[MRMIME]\nTypes=PSYCHIC")).toEqual([
      { ...header(), name: "Mrmime", types: ["psychic"] },
    ]);
  });

  test("builtin pokemon can omit types", () => {
    expect(p("[BULBASAUR]\nName=Bulbasaur")).toEqual([{ ...header(), species: "bulbasaur" }]);
    expect(p("[BULBASAUR]")).toEqual([{ ...header(), species: "bulbasaur" }]);
  });

  test("multiple omitting everything", () => {
    expect(p("[BULBASAUR]\n[IVYSAUR]")).toEqual([
      { ...header(), species: "bulbasaur" },
      { ...header(), species: "ivysaur" },
    ]);
  });

  test("forms are ignored", () => {
    expect(p("[FOO,1]\nName=Foo\n[BULBASAUR]")).toEqual([{ ...header(), species: "bulbasaur" }]);
  });

  test("duplicates are allowed", () => {
    expect(p("[BULBASAUR]\n[BULBASAUR]")).toEqual([
      { ...header(), species: "bulbasaur" },
      { ...header(), species: "bulbasaur" },
    ]);
  });

  test("multiple files", () => {
    expect(p("[BULBASAUR]", "[IVYSAUR]")).toEqual([
      { ...header(), species: "bulbasaur" },
      { ...header(), species: "ivysaur" },
    ]);
  });

  test("missing section at start is an error", () => {
    expect(() => p("Name=Bulbasaur")).toThrow(
      expect.objectContaining({
        name: "PBSMissingSectionError",
        fileName: "f0",
        lineIndex: 0,
      }),
    );
  });

  test("custom pokemon missing types is an error", () => {
    expect(() => p("[FOO]")).toThrow(
      expect.objectContaining({
        errors: [
          expect.objectContaining({
            name: "PBSMissingTypesError",
            fileName: "f0",
            essentialsId: "FOO",
            lineIndex: 0,
          }),
        ],
      }),
    );
    expect(() => p("[FOO]\nName=Bar")).toThrow(
      expect.objectContaining({
        errors: [
          expect.objectContaining({
            name: "PBSMissingTypesError",
            fileName: "f0",
            essentialsId: "FOO",
            lineIndex: 0,
          }),
        ],
      }),
    );
  });
});
