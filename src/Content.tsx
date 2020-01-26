import React, { useContext, useState } from 'react'
import { AppContext } from './App'
import Tutorial from './Tutorial';
import Observations from './Observations';
import { ErrorContext } from './ErrorBoundary';
import ContentError from './ContentError';

export default function Content() {
  const [{ mons }] = useContext(AppContext);
  const [error] = useContext(ErrorContext);
  const [openTutorial, setOpenTutorial] = useState(false);

  if (error) {
    return <ContentError />;
  }

  const showTutorial = openTutorial || mons.length === 0;

  return (
    <div className="Content">
      <h1>
        Stardex
      </h1>

      {mons.length > 0 && (
        <div className="link" onClick={() => setOpenTutorial(!openTutorial)}>
          {openTutorial ? 'Hide' : 'Show'} the tutorial.
        </div>
      )}

      {showTutorial ? <Tutorial /> : <Observations />}
    </div>
  )
}