/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Fragment, useContext } from 'react';
import { STRICTNESS_NAMES, STRICTNESSES } from '../models/Recommendations';
import { capitalize } from '../helpers/string';
import { AppContext } from '../App';

export default function Settings() {
  const [{ strictness }, dispatch] = useContext(AppContext);

  return (
    <Fragment>
      <h3>
        Strictness
      </h3>

      <p>
        Strictness controls how much Stardex expects you to adhere to the type distribution in the region(s) you've chosen to compare against. If you're using Stardex as a guideline, choose "easygoing" or "normal". If you care more about balance, choose "strict" and if you care so much about balance that you're willing to spend a long time shifting Pokémon around to appease the algorithm gods, choose "bitchy".
      </p>

      {STRICTNESS_NAMES.map(name => (
        <label key={name} css={{ display: 'block' }}>
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
    </Fragment>
  );
}