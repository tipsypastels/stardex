import { getStrictnessMaximumRatioDifference, type Strictness } from "$lib/models/strictness";
import { BUILTIN_TYPE_KEYS, isTypeCustom, resolveType, type Type } from "$lib/models/type";
import { sortStrings } from "$lib/utils/strings";
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
  strictness: Strictness,
) {
  const recs: Recommendation[] = [];
  const maxDiff = getStrictnessMaximumRatioDifference(strictness);

  const own = withEmptiesAndSortedByTypeName(ownAllot);
  const against = withEmptiesAndSortedByTypeName(againstAllot);

  for (let i = 0; i < own.length; i++) {
    const ownAllotedType = own[i];
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
  const unusedTypeKeys = new Set<string>(BUILTIN_TYPE_KEYS);

  for (const allotedType of allot.types.values()) {
    if (isTypeCustom(allotedType.typeKey)) {
      continue;
    }

    unusedTypeKeys.delete(allotedType.typeKey);
    out.push(allotedType);
  }

  for (const typeKey of unusedTypeKeys) {
    const type = resolveType(typeKey);
    out.push({ typeKey, type, count: 0, ratio: 0 });
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
