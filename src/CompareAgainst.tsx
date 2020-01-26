import React, { useContext, useState } from 'react'
import { AppContext } from './App'
import { REGION_NAMES } from './Region';
import { capitalize } from './helpers/string';
import Breakdown from './Breakdown';
import Button from './Button';
import pluralize from 'pluralize';

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

      <Button 
        disabled={selectedRegionMons.length === 0} 
        onClick={() => setShowBreakdown(!showBreakdown)}
      >
        {selectedRegionMons.length ? (
          <>{showBreakdown ? 'Hide' : 'Show'} breakdown of selected {pluralize('region', regions.size)}.</>
        ): (
          <>Select at least one region to show breakdown.</>
        )}
      </Button>

      {showBreakdown && selectedRegionMons.length > 0 && (
        <Breakdown mons={selectedRegionMons} />
      )}
    </div>
  )
}
