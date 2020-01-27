import React, { useContext } from 'react'
import { ErrorContext } from './shared/ErrorBoundary'
import Tutorial from './Tutorial';

export default function ContentError() {
  const [error] = useContext(ErrorContext);

  if (!error) {
    return null;
  }

  return (
    <div className="Content Content--error">
      <h1>
        That's an error.
      </h1>

      {error.message}

      <h2>
        How to use Stardex.
      </h2>

      <Tutorial welcome={false} />
    </div>
  )
}
