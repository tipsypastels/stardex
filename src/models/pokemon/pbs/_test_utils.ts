import type { NamedText } from "../../../utils/file";

export function readPBSSampleSync(
  name: string,
  readFileSync: (name: string, _: "utf-8") => string,
): NamedText {
  return {
    name,
    text: readFileSync(`samples/pbs/${name}.txt`, "utf-8"),
  };
}
