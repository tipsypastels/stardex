import { expect, test } from "vitest";
import { resolveRegion } from "./region";

test("resolveRegion", () => {
  // @ts-expect-error no matching region.
  expect(resolveRegion("nonexistant")).toBeUndefined();
  expect(resolveRegion("alola").name).toBe("Alola");
});
