import React from 'react'
import { Type } from './models/Type'
import Icon from './Icon'
import { capitalize } from './helpers/string'

type Props = {
  type: Type,
}

export default function TypeName({ type }: Props) {
  return (
    <strong style={{ color: type.color }}>
      <Icon src={type.icon} fw /> {capitalize(type.name)}
    </strong>
  );
}
