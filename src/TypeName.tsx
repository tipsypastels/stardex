import React from 'react'
import { Type } from './models/Type'
import Icon from './Icon'
import { capitalize } from './helpers/string'

type Props = 
  | { type: Type }
  | { name: string }

export default function TypeName(props: Props) {
  const type = ('type' in props)
    ? props.type
    : new Type(props.name)
    
  return (
    <strong style={{ color: type.color }}>
      <Icon src={type.icon} fw /> {capitalize(type.name)}
    </strong>
  );
}
