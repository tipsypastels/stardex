import { TYPE_KEY_PAIRS } from "../../type/key_pair";
import type { PBSRecord } from "./parse";

export function getPBSRecordTypeKeys(record: PBSRecord, ifChangedFrom?: string[]) {
  const keys = record.fields.types?.toLowerCase().split(/\s*,\s*/);
  if (!keys) return;
  if (ifChangedFrom && TYPE_KEY_PAIRS.equal(keys, ifChangedFrom)) return;
  return keys;
}
