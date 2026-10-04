import { describe, expect, test } from "vitest";
import { parsePokemonListText } from "./parse";

describe(parsePokemonListText, () => {
  const p = parsePokemonListText;
  const pHeader = () => ({ v: 1, id: expect.any(String) });

  test("empty", () => {
    expect(p("")).toEqual({ list: { v: 2, all: [], verbatimText: [[], {}] }, errors: [] });
  });

  test("single", () => {
    expect(p("charmander")).toEqual({
      list: {
        v: 2,
        all: [{ ...pHeader(), species: "charmander" }],
        verbatimText: [[], {}],
      },
      errors: [],
    });
    expect(p("Charmander")).toEqual({
      list: {
        v: 2,
        all: [{ ...pHeader(), species: "charmander" }],
        verbatimText: [[], {}],
      },
      errors: [],
    });
  });

  test("multiple", () => {
    expect(p("charmander\ncharmeleon\ncharizard")).toEqual({
      list: {
        v: 2,
        all: [
          { ...pHeader(), species: "charmander" },
          { ...pHeader(), species: "charmeleon" },
          { ...pHeader(), species: "charizard" },
        ],
        verbatimText: [[], {}],
      },
      errors: [],
    });
  });

  test("blank lines", () => {
    expect(p("\n")).toEqual({ list: { v: 2, all: [], verbatimText: [[], {}] }, errors: [] });
    expect(p("charmander")).toEqual({
      list: {
        v: 2,
        all: [{ ...pHeader(), species: "charmander" }],
        verbatimText: [[], {}],
      },
      errors: [],
    });
    expect(p("charmander\n\ncharmeleon\n\ncharizard")).toEqual({
      list: {
        v: 2,
        all: [
          { ...pHeader(), species: "charmander" },
          { ...pHeader(), species: "charmeleon" },
          { ...pHeader(), species: "charizard" },
        ],
        verbatimText: [[], { 0: [""], 1: [""] }],
      },
      errors: [],
    });
  });

  test("comments", () => {
    expect(p("# hello!\ncharmander")).toEqual({
      list: {
        v: 2,
        all: [{ ...pHeader(), species: "charmander" }],
        verbatimText: [["# hello!"], {}],
      },
      errors: [],
    });
  });

  test("trimming", () => {
    expect(p(" # hello!  \n   charmander  (  x  : fire /  flying) ")).toEqual({
      list: {
        v: 2,
        all: [
          { ...pHeader(), species: "charmander", types: ["fire", "flying"], customAltName: "x" },
        ],
        verbatimText: [["# hello!"], {}],
      },
      errors: [],
    });
  });

  test("exclude", () => {
    expect(p("charmander @exclude")).toEqual({
      list: {
        v: 2,
        all: [{ ...pHeader(), species: "charmander", exclude: true }],
        verbatimText: [[], {}],
      },
      errors: [],
    });
    expect(p("charmander @ignore")).toEqual({
      list: {
        v: 2,
        all: [{ ...pHeader(), species: "charmander", exclude: true }],
        verbatimText: [[], {}],
      },
      errors: [],
    });
  });

  test("types", () => {
    expect(p("charmander (water)")).toEqual({
      list: {
        v: 2,
        all: [{ ...pHeader(), species: "charmander", types: ["water"] }],
        verbatimText: [[], {}],
      },
      errors: [],
    });
    expect(p("charmander (Water/Flying)")).toEqual({
      list: {
        v: 2,
        all: [{ ...pHeader(), species: "charmander", types: ["water", "flying"] }],
        verbatimText: [[], {}],
      },
      errors: [],
    });
  });

  test("alts", () => {
    expect(p("blastoise (mega:)\ncharizard (mega x:)")).toEqual({
      list: {
        v: 2,
        all: [
          { ...pHeader(), species: "blastoise", alt: "mega" },
          { ...pHeader(), species: "charizard", alt: "mega-x" },
        ],
        verbatimText: [[], {}],
      },
      errors: [],
    });
  });

  test("known alt type hack", () => {
    expect(p("blastoise (mega)\ncharizard (mega x)\npikachu (mega)")).toEqual({
      list: {
        v: 2,
        all: [
          { ...pHeader(), species: "blastoise", alt: "mega" },
          { ...pHeader(), species: "charizard", alt: "mega-x" },
          { ...pHeader(), species: "pikachu", types: ["mega"] },
        ],
        verbatimText: [[], {}],
      },
      errors: [],
    });
  });

  test("altname aliases", () => {
    expect(p("castform (sun:)\ncastform (rain:)\ntauros (combat)\ntauros (aqua breed)")).toEqual({
      list: {
        v: 2,
        all: [
          { ...pHeader(), species: "castform", alt: "sunny" },
          { ...pHeader(), species: "castform", alt: "rainy" },
          { ...pHeader(), species: "tauros", alt: "paldea-combat-breed" },
          { ...pHeader(), species: "tauros", alt: "paldea-aqua-breed" },
        ],
        verbatimText: [[], {}],
      },
      errors: [],
    });
  });

  test("matching against noaltname", () => {
    expect(p("landorus (incarnate:)\nlandorus (therian:)")).toEqual({
      list: {
        v: 2,
        all: [
          { ...pHeader(), species: "landorus" },
          { ...pHeader(), species: "landorus", alt: "therian" },
        ],
        verbatimText: [[], {}],
      },
      errors: [],
    });
    expect(p("landorus (incarnate)\nlandorus (therian)")).toEqual({
      list: {
        v: 2,
        all: [
          { ...pHeader(), species: "landorus" },
          { ...pHeader(), species: "landorus", alt: "therian" },
        ],
        verbatimText: [[], {}],
      },
      errors: [],
    });
  });

  test("known alt type hack is never used if an explicit colon starts the type list", () => {
    expect(p("blastoise (:mega)")).toEqual({
      list: {
        v: 2,
        all: [{ ...pHeader(), species: "blastoise", types: ["mega"] }],
        verbatimText: [[], {}],
      },
      errors: [],
    });
  });

  test("customs", () => {
    expect(p("foo (fire)\nbar (livnan:water)")).toEqual({
      list: {
        v: 2,
        all: [
          { ...pHeader(), name: "foo", types: ["fire"] },
          { ...pHeader(), name: "bar", types: ["water"], altName: "livnan" },
        ],
        verbatimText: [[], {}],
      },
      errors: [],
    });
    expect(p("foo (fire/fantasy)\n\nbar (Mega X:water/fantasy")).toEqual({
      list: {
        v: 2,
        all: [
          { ...pHeader(), name: "foo", types: ["fire", "fantasy"] },
          { ...pHeader(), name: "bar", types: ["water", "fantasy"], altName: "Mega X" },
        ],
        verbatimText: [[], { 0: [""] }],
      },
      errors: [],
    });
  });

  test("duplicates", () => {
    expect(p("charmander\ncharmander\ncharmander (water)")).toEqual({
      list: {
        v: 2,
        all: [
          { ...pHeader(), species: "charmander" },
          { ...pHeader(), species: "charmander" },
          { ...pHeader(), species: "charmander", types: ["water"] },
        ],
        verbatimText: [[], {}],
      },
      errors: [],
    });
  });

  test("everything", () => {
    expect(
      p(
        "# the gauntlet:\ncharmander (water)\ncharmeleon (water) @exclude\ncharizard (water/flying)\n\nfoo @exclude (fire/fantasy)",
      ),
    ).toEqual({
      list: {
        v: 2,
        all: [
          { ...pHeader(), species: "charmander", types: ["water"] },
          { ...pHeader(), species: "charmeleon", types: ["water"], exclude: true },
          { ...pHeader(), species: "charizard", types: ["water", "flying"] },
          { ...pHeader(), name: "foo", types: ["fire", "fantasy"], exclude: true },
        ],
        verbatimText: [["# the gauntlet:"], { 2: [""] }],
      },
      errors: [],
    });
  });
});
