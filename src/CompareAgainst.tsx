/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useContext, useState, useMemo, Fragment } from 'react'
import { AppContext } from './App'
import { REGION_NAMES } from './models/Region';
import { capitalize } from './helpers/string';
import Breakdown from './shared/Breakdown';
import Button from './shared/Button';
import pluralize from 'pluralize';
import Note from './shared/Note';
import TypeName from './shared/TypeName';
import PokemonList from './models/PokemonList';
import REGION_DATA from './data/REGION_DATA';
import { SlideDown } from 'react-slidedown';
import Divider from './shared/Divider';
import Modal from './shared/Modal';

export default function CompareAgainst() {
  const [{ regions, mons }, dispatch] = useContext(AppContext);
  const selectedRegionMons = useSelectedRegionMons();
  const [showSbs, setShowSbs] = useState(false);

  return (
    <div className="">
      <p>
        Select one or more regions to compare against. The distribution of types (for example, what percent of the region's Pokémon are <TypeName name="Fire" /> type) will be used to inform recommended changes.
      </p>

      <div className="CompareAgainst__options">
        {REGION_NAMES.map(region => (
          <label key={region} css={{ display: 'block' }}>
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

      <SlideDown transitionOnAppear={false}>
        {selectedRegionMons.length > 0 && (
          <Fragment>
            <Divider />

            <h2>
              Breakdown of selected {pluralize('region', regions.size)}
            </h2>
            <Breakdown mons={selectedRegionMons} />

            <Button onClick={() => setShowSbs(true)}>
              Show next to my Pokédex
            </Button>

            <Modal open={showSbs} onClose={() => setShowSbs(false)}>
              <h2>
                My Pokédex
              </h2>

              <Breakdown mons={mons} />

              <Divider />

              <h2>
                Selected {pluralize('Region', regions.size)} Pokédex
              </h2>

              <Breakdown mons={selectedRegionMons} />
            </Modal>
          </Fragment>
        )}
      </SlideDown>
    </div>
  )
}

export function useSelectedRegionMons(): PokemonList {
  const [{ regions }] = useContext(AppContext);

  return useMemo(() => {
    const regionsArray = [...regions];
    return PokemonList.combine(regionsArray.map(
      region => REGION_DATA[region]
    ));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [regions.join('')]);
}