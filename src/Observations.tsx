import React, { useContext } from 'react'
import { AppContext } from './App';
import Breakdown from './Breakdown';
import CompareAgainst from './CompareAgainst';

export default function Observations() {
  const [{ mons }] = useContext(AppContext);
  const fillerCount = mons.withMod('@filler').length;

  return (
    <div className="Observations">
      <div>
        Pokédex size: <strong>{mons.length}</strong>.
      </div>

      {fillerCount > 0 && <div>
        Filler count: <strong>{fillerCount}</strong>.
      </div>}

      <Breakdown mons={mons} />
      <CompareAgainst />

      <h2>
        Recommendations
      </h2>

      TODO
    </div>
  )
}