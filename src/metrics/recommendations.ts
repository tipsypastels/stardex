import { Set as ISet } from "immutable";
import { BUILTIN_TYPES, TYPES, type Type } from "../models/type";
import { sortStrings } from "../utils/string";
import type { AllotedType, Allotment } from "./allotment";

export type RecommendedChange = "none" | "add" | "remove";

export interface Recommendation {
  type: Type;
  ownRatio: number;
  againstRatio: number;
  change: RecommendedChange;
}

export function createRecommendations(
  ownAllot: Allotment,
  againstAllot: Allotment,
  maxDiff: number,
  excludedTypeKeys: ISet<string>,
) {
  const recs: Recommendation[] = [];

  const own = withEmptiesAndSortedByTypeName(ownAllot);
  const against = withEmptiesAndSortedByTypeName(againstAllot);

  for (let i = 0; i < own.length; i++) {
    const ownAllotedType = own[i];

    if (excludedTypeKeys.has(ownAllotedType.type.key)) {
      continue;
    }

    const againstAllotedType = against[i];

    const ownRatio = ownAllotedType.ratio;
    const againstRatio = againstAllotedType.ratio;

    const type = ownAllotedType.type;
    const change = chooseChange(ownRatio, againstRatio, maxDiff);

    recs.push({ type, ownRatio, againstRatio, change });
  }

  return recs;
}

function withEmptiesAndSortedByTypeName(allot: Allotment): AllotedType[] {
  const out: AllotedType[] = [];
  const unusedTypeKeys = new Set<string>(BUILTIN_TYPES.keys);

  for (const allotedType of allot.types.values()) {
    if (allotedType.type.kind === "custom") {
      continue;
    }

    unusedTypeKeys.delete(allotedType.type.key);
    out.push(allotedType);
  }

  for (const typeKey of unusedTypeKeys) {
    const type = TYPES.of(typeKey);
    out.push({ type, count: 0, ratio: 0 });
  }

  out.sort((a, b) => sortStrings(a.type.name, b.type.name));
  return out;
}

function chooseChange(ownRatio: number, againstRatio: number, maxDiff: number): RecommendedChange {
  if (ownRatio - againstRatio > maxDiff) {
    return "remove";
  } else if (againstRatio - ownRatio > maxDiff) {
    return "add";
  }
  return "none";
}
