import React, { useContext, useState } from 'react'
import { AppContext } from './App'
import Tutorial from './Tutorial';
import Observations from './Observations';
import { ErrorContext } from './ErrorBoundary';
import ContentError from './ContentError';
import Icon from './Icon';

export default function Content() {
  const [{ mons, mobEditorOpen }, dispatch] = useContext(AppContext);
  const [error] = useContext(ErrorContext);
  const [openTutorial, setOpenTutorial] = useState(false);

  if (error) {
    return <ContentError />;
  }

  const showTutorial = openTutorial || mons.length === 0;

  return (
    <div className="Content">
      <h1 style={{ display: 'flex' }}>
        <span style={{ flexGrow: 1 }}>
          Stardex
        </span>

        <Icon
          className="Content__editor_toggle mobile"
          src={[mobEditorOpen
            ? 'caret-square-left'
            : 'caret-square-right', 'far']
          }
          onClick={() => dispatch({
            type: 'SET_MOB_EDITOR_OPEN',
            open: !mobEditorOpen,
          })}
        />
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