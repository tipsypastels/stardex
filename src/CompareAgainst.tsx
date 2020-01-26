import React, { useContext, useState } from 'react'
import { AppContext } from './App'
import { REGION_NAMES } from './models/Region';
import { capitalize } from './helpers/string';
import Breakdown from './Breakdown';
import Button from './Button';
import pluralize from 'pluralize';
import Note from './Note';
import TypeName from './TypeName';
import Icon from './Icon';

export default function CompareAgainst() {
  const [{ regions, selectedRegionMons }, dispatch] = useContext(AppContext);
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="CompareAgainst">
      <h2>
        Compare Against
      </h2>

      <div className="CompareAgainst__options">
        {REGION_NAMES.map(region => (
          <label key={region}>
            <input
              type="checkbox"
              checked={regions.has(region)}
              onChange={e => dispatch({
                type: e.target.checked ? 'ENABLE_REGION' : 'DISABLE_REGION',
                region, 
              })}
            />

            {capitalize(region)}
          </label>
        ))}
      </div>

      {regions.has('kanto') && (
        <Note>
          Kanto has a skewed type balance by the standards of later regions - for example, too many <TypeName name="Poison" /> types. You may find that you get better results if you leave it out.
        </Note>
      )}

      <Button
        disabled={selectedRegionMons.length === 0 && !showBreakdown} 
        onClick={() => setShowBreakdown(!showBreakdown)}
      >
        {showBreakdown ? 'Hide' : 'Show'} breakdown of selected {pluralize('region', regions.size)}.
      </Button>

      {showBreakdown && (
        selectedRegionMons.length > 0
          ? <Breakdown mons={selectedRegionMons} />
          : (
            <Note className="CompareAgainst__no_breakdown">
              <Icon src="empty-set" />
              Select at least one region to show breakdown.
            </Note>
          )
      )}
    </div>
  )
}
