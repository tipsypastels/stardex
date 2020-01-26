import React, { useContext } from 'react'
import { AppContext } from './App'
import { capitalize } from './helpers/string';
import RecommendedChange from './RecommendedChange';
import Recommendations, { STRICTNESS_NAMES, STRICTNESSES } from './models/Recommendations';
import Note from './Note';

export default function RecommendationsList() {
  const [{ mons, selectedRegionMons, strictness }, dispatch] = useContext(AppContext);

  const recommendations = Recommendations.generate({
    ownMons: mons,
    comparedMons: selectedRegionMons,
    strictness,
  });

  return (
    <div className="Recommendations">
      <h2>
        Recommendations
      </h2>

      <div className="Recommendations__strictness">
        <h4>
          Strictness
        </h4>

        {STRICTNESS_NAMES.map(name => (
          <label key={name}>
            <input 
              name="strictness"
              type="radio"
              checked={strictness === STRICTNESSES[name]}
              onChange={e => {
                if (e.target.checked) {
                  dispatch({ 
                    type: 'SET_STRICTNESS', 
                    strictness: STRICTNESSES[name],
                  });
                }
              }}
            />
            {capitalize(name)}
          </label>
        ))}
      </div>

      <div className="Recommendations__changes">
        {recommendations.length === 0
          ? (
            <Note>
              <strong>You have no recommendations!</strong> Your Pokédex is perfectly balanced, as all things should be. {strictness > STRICTNESSES.bitchy && <>If you're not satisfied, try <strong>raising the strictness</strong> to get more results.</>}
            </Note>
          ) : recommendations.map(rec => (
                <RecommendedChange
                  key={rec.type.name}
                  recommendation={rec}
                />
              ))
        }
      </div>
    </div>
  )
}
