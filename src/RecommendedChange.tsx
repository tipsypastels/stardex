import React, { useContext } from 'react'
import Icon from './Icon'
import { capitalize } from './helpers/string'
import { Recommendation } from './models/Recommendations'
import { AppContext } from './App'
import { nodesToSentence } from './helpers/array'
import Pokemon from './models/Pokemon'

type Props = {
  recommendation: Recommendation,
}

export default function RecommendedChange({ recommendation }: Props) {
  const [{ mons, regions }] = useContext(AppContext);
  const { type, ownPercent, comparedPercent, action } = recommendation;

  let fillers: Pokemon[] = [];
  if (recommendation.action === 'remove') {
    fillers = mons.withMod('filler', mon => {
      return mon.types.map(t => t.name).includes(type.name);
    });
  }

  return (
    <div className="RecommendedChange">
      <span style={{ color: type.color }}>
        <Icon src={type.icon} fw />
      </span>

      <div className="RecommendedChange__content">
        <h3>
          <span className={`action action--${action}`}>
            {capitalize(action)}
          </span> some <strong style={{ color: type.color }}>
            {capitalize(type.name)}
          </strong> types.
        </h3>

        <small>
          They make up <strong>{ownPercent.toFixed(1)}%</strong> of your Pokédex, and <strong>{comparedPercent.toFixed(1)}%</strong> of the compared Pokédex{regions.size > 1 && 'es on average'}.&nbsp;

          {fillers.length > 0 && (
            <>
              You may want to remove filler Pokémon {nodesToSentence(fillers.map(m => <strong key={m.name}>{m.name}</strong>), 'or')}.
            </>
          )}
        </small>
      </div>
    </div>
  )
}
