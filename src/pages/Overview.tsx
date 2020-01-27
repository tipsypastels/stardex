/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useContext, useState, Fragment } from 'react'
import { AppContext } from '../App'
import Breakdown from '../shared/Breakdown';
import { Type } from '../models/Type';
import TypeName from '../shared/TypeName';
import Divider from '../shared/Divider';
import { useRecommendations } from '../models/Recommendations';
import { capitalize } from '../helpers/string';
import PokemonTable from '../shared/PokemonTable';
import { nodesToSentence } from '../helpers/array';
import Pokemon from '../models/Pokemon';
import Note from '../shared/Note';
import { Link } from 'react-router-dom';
import { STRICTNESSES } from '../models/Recommendations';

export default function Overview() {
  const [{ mons, regions, strictness }] = useContext(AppContext);
  const [inspectedType, setInspectedType] = useState<Type | null>(null);
  const inspectedMons = inspectedType
    ? mons.filter(mon => mon.typeNames.includes(inspectedType.name))
    : []

  const recommendations = useRecommendations();
  
  return (
    <Fragment>
      <table className="visible">
        <tbody>
          <tr>
            <th>
              Pokédex size
            </th>

            <td>
              {mons.length}
            </td>
          </tr>

          <tr>
            <th>
              Filler count
            </th>

            <td>
              {mons.withMod('filler').length}
            </td>
          </tr>
        </tbody>
      </table>

      <h3>
        Type Distribution
      </h3>

      <Breakdown 
        mons={mons} 
        onClickType={setInspectedType}
        recommendations={recommendations}
      />

      {(() => {
        if (regions.size === 0) {
          return (
            <Note>
              To get recommendations, start by selecting at least one existing Pokémon region to compare against in the <Link to="/compare">Compare</Link> tab.
            </Note>
          )
        }

        if (Object.keys(recommendations).length === 0) {
          return (
            <Note>
              <strong>You have no recommendations!</strong> Your Pokédex is perfectly balanced, as all things should be. {strictness > STRICTNESSES.bitchy && <Fragment>If you're not satisfied, try <strong>raising the strictness</strong> to get more results.</Fragment>}
            </Note>
          )
        }
      })()}

      {inspectedType && (
        <Fragment>
          <Divider />

          <small className="link" onClick={() => setInspectedType(null)}>
            Close inspector
          </small>

          <h2>
            <TypeName type={inspectedType} />
          </h2>

          {(() => {
            const rec = recommendations[inspectedType.name];
            if (!rec) {
              return null;
            }

            let fillers: Pokemon[] = [];
            if (rec.action === 'remove') {
              fillers = mons.withMod('filler', mon => {
                return mon.types.map(t => t.name).includes(inspectedType.name);
              });
            }

            return (
              <Fragment>
                <h3>
                  Recommendations
                </h3>

                <p>
                  <strong>Recommended: <span className={rec.action}>{capitalize(rec.action)}</span></strong> some. They make up <strong>{rec.ownPercent.toFixed(1)}%</strong> of your Pokédex, and <strong>{rec.comparedPercent.toFixed(1)}%</strong> of the compared Pokédex{regions.size > 1 && 'es on average'}.&nbsp;

                  {fillers.length > 0 && (
                    <Fragment>
                      You may want to remove filler Pokémon {nodesToSentence(fillers.map(m => <strong key={m.name}>{m.name}</strong>), 'or')}
                    </Fragment>
                  )}
                </p>

                <Divider />
              </Fragment>
            )
          })()}

          <h3>
            In your Pokédex
          </h3>

          <p>
            Your Pokédex includes {inspectedMons.length} <TypeName type={inspectedType} /> type Pokémon.
          </p>

          <PokemonTable mons={inspectedMons} />
        </Fragment>
      )}
    </Fragment>
  )
}
