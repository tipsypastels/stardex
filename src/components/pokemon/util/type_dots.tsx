import type { Type } from "../../../models/type";

export interface TypeDotsProps {
  types: Type[];
}

export function TypeDots({ types }: TypeDotsProps) {
  return (
    <ul class="absolute top-0 left-0 flex">
      {types.map((type) => (
        <li
          class="mr-1 h-2.5 w-2.5 rounded-full"
          style={`background-color: ${type.color}`}
          title={`${type.name} Type`}
        ></li>
      ))}
    </ul>
  );
}
