import { describe, expect, test } from "vitest";
import { textPokedexToRawPokemons } from "./text";

function parse(...s: string[]) {
  return textPokedexToRawPokemons(s.join("\n")).pokemons;
}

describe(parse, () => {
  test("single", () => {
    expect(parse("charmander")).toEqual([{ v: 1, species: "charmander" }]);
    expect(parse("Charmander")).toEqual([{ v: 1, species: "charmander" }]);
  });

  test("multiple", () => {
    expect(parse("charmander", "charmeleon", "charizard")).toEqual([
      { v: 1, species: "charmander" },
      { v: 1, species: "charmeleon" },
      { v: 1, species: "charizard" },
    ]);
  });

  test("comments", () => {
    expect(parse("# hello", "pikachu")).toEqual([{ v: 1, species: "pikachu", comment: "hello" }]);
    expect(parse("# hello\n# world\npikachu")).toEqual([
      { v: 1, species: "pikachu", comment: "hello\nworld" },
    ]);
  });

  test("newlines", () => {
    expect(parse("pikachu", "", "raichu")).toEqual([
      { v: 1, species: "pikachu" },
      { v: 1, species: "raichu", newlinesBefore: 1 },
    ]);
  });

  test("exclude", () => {
    expect(parse("pikachu @exclude")).toEqual([{ v: 1, species: "pikachu", exclude: true }]);
    expect(parse("pikachu @ignore")).toEqual([{ v: 1, species: "pikachu", exclude: true }]);
  });

  test("types", () => {
    expect(parse("pikachu (fire)")).toEqual([{ v: 1, species: "pikachu", types: ["fire"] }]);
    expect(parse("pikachu (fire/fighting)")).toEqual([
      { v: 1, species: "pikachu", types: ["fire", "fighting"] },
    ]);
  });

  test("types and exclude", () => {
    expect(parse("pikachu (fire) @exclude")).toEqual([
      { v: 1, species: "pikachu", types: ["fire"], exclude: true },
    ]);
    expect(parse("pikachu @exclude (fire)")).toEqual([
      { v: 1, species: "pikachu", types: ["fire"], exclude: true },
    ]);
  });
});
