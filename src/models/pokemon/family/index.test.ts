import { describe, expect, test } from "vitest";
import { FAMILIES } from ".";
import { SPECIES } from "../species";

describe("species families", () => {
  const f = (key: string) => FAMILIES.of(SPECIES.of(key)).map((s) => s.key);

  function testFromEveryInitial(keys: string[]) {
    for (const key of keys) {
      expect(f(key)).toEqual(keys);
    }
  }

  test("does not evolve", () => {
    testFromEveryInitial(["absol"]);
  });

  test("two-line", () => {
    testFromEveryInitial(["rattata", "raticate"]);
  });

  test("three-line", () => {
    testFromEveryInitial(["squirtle", "wartortle", "blastoise"]);
  });

  test("split line is sorted depth first", () => {
    testFromEveryInitial(["wurmple", "silcoon", "beautifly", "cascoon", "dustox"]);
  });

  test("pre-evos are sorted first", () => {
    testFromEveryInitial(["pichu", "pikachu", "raichu"]);
  });
});
