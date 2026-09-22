import { describe, expect, test } from "vitest";
import { deletePokemonListVerbatimTextEntry, PokemonListVerbatimTextBuilder } from "./verbatim";

describe(deletePokemonListVerbatimTextEntry, () => {
  test("moves entries after the deleted index down one", () => {
    expect(
      deletePokemonListVerbatimTextEntry([["zzz"], { 0: ["hi"], 2: ["bye"], 3: ["xd"] }], 1),
    ).toEqual([["zzz"], { 0: ["hi"], 1: ["bye"], 2: ["xd"] }]);
  });

  test("merges onto lines that already have text", () => {
    expect(deletePokemonListVerbatimTextEntry([["zzz"], { 0: ["hi"], 1: ["bye"] }], 1)).toEqual([
      ["zzz"],
      { 0: ["hi", "bye"] },
    ]);
  });

  test("deleting the first entry moves its lines to beforeAll", () => {
    expect(deletePokemonListVerbatimTextEntry([["zzz"], { 0: ["hi"], 1: ["bye"] }], 0)).toEqual([
      ["zzz", "hi"],
      { 0: ["bye"] },
    ]);
  });

  test("oob does nothing", () => {
    expect(deletePokemonListVerbatimTextEntry([["zzz"], { 0: ["hi"], 1: ["bye"] }], -1)).toEqual([
      ["zzz"],
      { 0: ["hi"], 1: ["bye"] },
    ]);
  });
});

describe(PokemonListVerbatimTextBuilder, () => {
  const b = () => new PokemonListVerbatimTextBuilder();

  test("empty", () => {
    expect(b().finish()).toEqual([[], {}]);
  });

  test("verbatim before any entry goes to beforeAll", () => {
    expect(b().verbatim("x").finish()).toEqual([["x"], {}]);
  });

  test("entry indices", () => {
    expect(
      b().verbatim("x").entry().verbatim("y").verbatim("z").entry().verbatim("za").finish(),
    ).toEqual([["x"], { 0: ["y", "z"], 1: ["za"] }]);
  });

  test("does not output empty line arrays", () => {
    expect(b().entry().entry().verbatim("x").finish()).toEqual([[], { 1: ["x"] }]);
  });
});
