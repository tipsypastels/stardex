import { type Type, TYPES } from "../models/type";
import { sortStrings } from "../utils/string";

export interface Allotment {
  total: number;
  types: Map<string, AllotedType>;
}

export interface AllotedType {
  type: Type;
  count: number;
  ratio: number;
}

export interface Allotable {
  types: Type[];
  exclude?: boolean;
}

export function createAllotment(allotables: Iterable<Allotable>): Allotment {
  const counts = new Map<string, number>();
  let total = 0;

  for (const allotable of allotables) {
    if (allotable.exclude) {
      continue;
    }

    for (const type of allotable.types) {
      const currCount = counts.get(type.key) ?? 0;
      counts.set(type.key, currCount + 1);
      total += 1;
    }
  }

  const countEntries = Array.from(counts.entries());
  countEntries.sort(sortCountEntries);

  const types = new Map(
    countEntries.map(([typeKey, count]) => {
      const type = TYPES.of(typeKey);
      const ratio = count / total;
      return [typeKey, { type, count, ratio } satisfies AllotedType];
    }),
  );

  return { total, types };
}

function sortCountEntries([aName, aCnt]: [string, number], [bName, bCnt]: [string, number]) {
  return aCnt === bCnt ? sortStrings(aName, bName) : aCnt - bCnt;
}
