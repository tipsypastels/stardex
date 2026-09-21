import { describe, expect, test } from "vitest";
import {
  getPokemonListTextDiffVerbatimSuffixAt,
  PokemonListTextDiffBuilder,
  readPokemonListTextDiff,
  setPokemonListTextDiffVerbatimSuffixAt,
  unsetPokemonListTextDiffVerbatimSuffixAt,
} from "./diff";

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

describe(getPokemonListTextDiffVerbatimSuffixAt, () => {
  test("empty", () => {
    expect(getPokemonListTextDiffVerbatimSuffixAt([], 0)).toBeUndefined();
  });

  test("single entry no diff", () => {
    expect(getPokemonListTextDiffVerbatimSuffixAt(["\0e1"], 0)).toBeUndefined();
  });

  test("single entry has diff", () => {
    expect(getPokemonListTextDiffVerbatimSuffixAt(["\0wx"], 0)).toBe("x");
  });

  test("multiple entries one has diff", () => {
    expect(getPokemonListTextDiffVerbatimSuffixAt(["\0wx", "\0e1"], 0)).toBe("x");
    expect(getPokemonListTextDiffVerbatimSuffixAt(["\0e1", "\0wx"], 1)).toBe("x");
    expect(getPokemonListTextDiffVerbatimSuffixAt(["\0e2", "\0wx"], 2)).toBe("x");
  });

  test("with blank and verbatim lines", () => {
    expect(getPokemonListTextDiffVerbatimSuffixAt(["\0e2", "x", "\0e2", "\0wx"], 4)).toBe("x");
  });
});

describe(setPokemonListTextDiffVerbatimSuffixAt, () => {
  test("throws on overflow", () => {
    expect(() => setPokemonListTextDiffVerbatimSuffixAt([], 0, "")).toThrow();
    expect(() => setPokemonListTextDiffVerbatimSuffixAt(["\0e1"], 1, "")).toThrow();
  });

  test("setting a single entry", () => {
    expect(setPokemonListTextDiffVerbatimSuffixAt(["\0e1"], 0, "x")).toEqual(["\0wx"]);
  });

  test("setting an entry at the start of a run", () => {
    expect(setPokemonListTextDiffVerbatimSuffixAt(["\0e3"], 0, "x")).toEqual(["\0wx", "\0e2"]);
  });

  test("setting an entry at the end of a run", () => {
    expect(setPokemonListTextDiffVerbatimSuffixAt(["\0e3"], 2, "x")).toEqual(["\0e2", "\0wx"]);
  });

  test("setting an entry in the middle of a run", () => {
    expect(setPokemonListTextDiffVerbatimSuffixAt(["\0e3"], 1, "x")).toEqual([
      "\0e1",
      "\0wx",
      "\0e1",
    ]);
  });
});

describe(unsetPokemonListTextDiffVerbatimSuffixAt, () => {
  test("throws on overflow", () => {
    expect(() => unsetPokemonListTextDiffVerbatimSuffixAt([], 0)).toThrow();
    expect(() => unsetPokemonListTextDiffVerbatimSuffixAt(["\0e1"], 1)).toThrow();
  });

  test("noop", () => {
    expect(unsetPokemonListTextDiffVerbatimSuffixAt(["\0e1"], 0)).toEqual(["\0e1"]);
  });

  test("unsetting a single entry", () => {
    expect(unsetPokemonListTextDiffVerbatimSuffixAt(["\0wx"], 0)).toEqual(["\0e1"]);
  });

  test("unsetting an entry at the start of a run", () => {
    expect(unsetPokemonListTextDiffVerbatimSuffixAt(["\0wx", "\0e2"], 0)).toEqual(["\0e3"]);
  });

  test("unsetting an entry at the end of a run", () => {
    expect(unsetPokemonListTextDiffVerbatimSuffixAt(["\0e2", "\0wx"], 2)).toEqual(["\0e3"]);
  });

  test("unsetting an entry in the middle of a run", () => {
    expect(unsetPokemonListTextDiffVerbatimSuffixAt(["\0e1", "\0wx", "\0e1"], 1)).toEqual(["\0e3"]);
  });
});
