import React, { useContext } from 'react'
import { AppContext } from './App'
import Tutorial from './Tutorial';
import Observations from './Observations';
import { ErrorContext } from './ErrorBoundary';
import ContentError from './ContentError';

export default function Content() {
  const [{ mons }] = useContext(AppContext);
  const [error] = useContext(ErrorContext);

  if (error) {
    return <ContentError />;
  }


  return (
    <div className="Content">
      <h1>
        Stardex
      </h1>

      {mons.length > 0 ? <Observations /> : <Tutorial />}
    </div>
  )
}