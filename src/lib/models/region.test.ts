import { expect, test } from "vitest";
import { resolveRegion } from "./region";

test("resolveRegion", () => {
  expect(resolveRegion("nonexistant")).toBeUndefined();
  expect(resolveRegion("alola").name).toBe("Alola");
});
