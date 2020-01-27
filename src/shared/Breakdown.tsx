/** @jsx jsx */
import { jsx } from '@emotion/core';
import { capitalize } from '../helpers/string';
import { PieChart, Pie, Cell } from 'recharts';
import TypeName from './TypeName';
import PokemonList from '../models/PokemonList';
import { Type } from '../models/Type';
import { Recommendation } from '../models/Recommendations';
import Icon from './Icon';
import { mq } from '../styling';

const Styles = mq({
  display: 'flex',
  flexDirection: ['column', 'row'],
  alignItems: ['unset', 'center'],

  ul: {
    padding: 0,
    listStyleType: 'none',
    fontSize: '1rem',
    lineHeight: '1.7rem',
  },
});

type Props = {
  mons: PokemonList;
  onClickType?: (type: Type) => void;
  recommendations?: { [key: string]: Recommendation };
}

export default function Breakdown({ mons, onClickType, recommendations }: Props) {
  const dists = mons.distributions.list
    .sort((a, b) => b.count - a.count)

  const data = dists.map(({ type, count }) => ({
      name: capitalize(type.name),
      color: type.color,
      value: count,
    }));

  return (
    <div css={Styles}>
      <div>
        <PieChart width={400} height={400}>
          <Pie
            isAnimationActive={false}
            data={data}
            dataKey="value"
            labelLine={false}
            cx={200}
            cy={200}
            outerRadius={180}
            innerRadius={110}
          >
            {data.map(({ color }, index) => (
              <Cell key={index} fill={color} />
            ))}
          </Pie>
        </PieChart>
      </div>

      <ul>
        {dists.map(({ type, count, percent }) => (
          <li 
            key={type.name} 
            onClick={() => onClickType?.(type)}
            css={{ cursor: 'pointer' }}
          >
            <TypeName type={type} />
            &nbsp;—&nbsp;
            {percent.toFixed(1)}% ({count})
            &nbsp;

            <RecommendationTick
              recommendation={recommendations?.[type.name]}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

type RecommendationTickProps = {
  recommendation: Recommendation | undefined;
}

function RecommendationTick({ recommendation }: RecommendationTickProps) {
  if (!recommendation) {
    return null;
  }

  const icon = recommendation.action === 'add' 
    ? 'plus-square' 
    : 'minus-square';

  return (
    <strong 
      className={recommendation.action}
      title={`Recommended: ${capitalize(recommendation.action)} some ${capitalize(recommendation.type.name)} types.`}
    >
      <Icon src={icon} />
    </strong>
  )  
}