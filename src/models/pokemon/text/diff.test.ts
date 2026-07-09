import { describe, expect, test } from "vitest";
import { PokemonListTextDiffBuilder, readPokemonListTextDiff } from "./diff";

describe(PokemonListTextDiffBuilder, () => {
  const b = () => new PokemonListTextDiffBuilder();

  test("empty", () => {
    expect(b().finish()).toEqual(undefined);
  });

  test("trivial", () => {
    expect(b().entry().finish()).toEqual(undefined);
    expect(b().entry().entry().entry().finish()).toEqual(undefined);
    expect(b().blank(1).finish()).toEqual(undefined);
  });

  test("verbatim", () => {
    expect(b().verbatim("foo").finish()).toEqual(["foo"]);
    expect(b().verbatim("foo", "bar").finish()).toEqual(["foo", "bar"]);
    expect(b().verbatim("foo").verbatim("bar").finish()).toEqual(["foo", "bar"]);
  });

  test("blanks", () => {
    expect(b().blank(50).finish()).toEqual(["\0b50"]);
  });

  test("mixing entries and blanks", () => {
    expect(b().entry().blank(2).entry().entry().blank(1).entry().finish()).toEqual([
      "\0e1",
      "\0b2",
      "\0e2",
      "\0b1",
      "\0e1",
    ]);
  });

  test("mixing all three", () => {
    expect(
      b()
        .blank(2)
        .verbatim("foo")
        .entry()
        .entry()
        .verbatim("bar")
        .blank(4)
        .verbatim("baz")
        .entry()
        .finish(),
    ).toEqual(["\0b2", "foo", "\0e2", "bar", "\0b4", "baz", "\0e1"]);
  });
});

describe(readPokemonListTextDiff, () => {
  test("it", () => {
    expect([
      ...readPokemonListTextDiff(["\0e1", "foo", "\0b2", "bar", "baz", "\0e4", "quux"]),
    ]).toEqual([
      { type: "entries", count: 1 },
      { type: "verbatim", line: "foo" },
      { type: "blanks", count: 2 },
      { type: "verbatim", line: "bar" },
      { type: "verbatim", line: "baz" },
      { type: "entries", count: 4 },
      { type: "verbatim", line: "quux" },
    ]);
  });
});
