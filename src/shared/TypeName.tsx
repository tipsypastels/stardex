/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Type } from '../models/Type'
import Icon from './Icon'
import { capitalize } from '../helpers/string'

type Opts = 
  | { type: Type }
  | { name: string }

type Props = Opts & {
  onClick?: () => void;
}

export default function TypeName({ onClick, ...props }: Props) {
  const type = ('type' in props)
    ? props.type
    : new Type(props.name)
    
  return (
    <strong 
      onClick={onClick}
      css={{ 
        color: type.color,
        cursor: onClick ? 'pointer' : 'unset',
      }} 
    >
      <Icon src={type.icon} fw /> {capitalize(type.name)}
    </strong>
  );
}
