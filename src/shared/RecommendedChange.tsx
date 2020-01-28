/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Recommendation } from '../models/Recommendations';
import { capitalize } from '../helpers/string';
import { Type } from '../models/Type';
import TypeName from './TypeName';

const Styles = {
  'td, th': {
    padding: '0.25rem 0.5rem',
  }
};

type Props = {
  recommendation: Recommendation;
  onClick?: (type: Type) => void;
}

export default function RecommendedChange({ recommendation, onClick }: Props) {
  const { type, ownPercent, comparedPercent, action } = recommendation;

  return (
    <tr css={Styles}>
      <td>
        <TypeName type={type} onClick={() => onClick?.(type)} />
      </td>

      <td className={action}>
        {capitalize(action)}
      </td>

      <td>
        {ownPercent.toFixed(1)}%
      </td>

      <td>
        {comparedPercent.toFixed(1)}%
      </td>
    </tr>
  )
}