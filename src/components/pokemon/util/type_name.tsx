import type { Type } from "../../../models/type";
import { Icon } from "../../common/icon";

export interface TypeNameProps {
  type: Type;
}

export function TypeName(props: TypeNameProps) {
  return (
    <span class="whitespace-nowrap" style={`color: ${props.type.color}`}>
      <span class="pr-1">
        <Icon name={props.type.icon} />
      </span>
      <span>{props.type.name}</span>
    </span>
  );
}
