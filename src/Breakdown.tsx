import React from 'react'
import { capitalize } from './helpers/string';
import { PieChart, Pie, Cell } from 'recharts';
import TypeName from './TypeName';
import PokemonList from './models/PokemonList';

type Props = {
  mons: PokemonList,
}

export default function Breakdown({ mons }: Props) {
  const dists = mons.distributions.list
    .sort((a, b) => b.count - a.count)

  const data = dists.map(({ type, count }) => ({
      name: capitalize(type.name),
      color: type.color,
      value: count,
    }));

  return (
    <div className="Breakdown">
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
          >
            {data.map(({ color }, index) => (
              <Cell key={index} fill={color} />
            ))}
          </Pie>
        </PieChart>
      </div>

      <ul>
        {dists.map(({ type, count, percent }) => (
          <li key={type.name}>
            <TypeName type={type} />
            &nbsp;—&nbsp;
            {percent.toFixed(1)}% ({count})
          </li>
        ))}
      </ul>
    </div>
  )
}
