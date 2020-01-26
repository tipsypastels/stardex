import React, { useContext } from 'react'
import { AppContext } from './App';
import Breakdown from './Breakdown';
import CompareAgainst from './CompareAgainst';
import RecommendationsList from './RecommendationsList';

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
      <RecommendationsList />
    </div>
  )
}