import React, { useCallback, useEffect, useContext, useRef } from 'react'
import Pokemon from './models/Pokemon';
import { useLocalStorageState } from './helpers/hooks';
import { AppContext } from './App';
import { ErrorContext } from './ErrorBoundary';
import Icon from './Icon';

const RELOAD_AFTER = 1000; // ms

export default function Editor() {
  const [, setError] = useContext(ErrorContext);
  const [, dispatch] = useContext(AppContext);
  const [text, setText] = useLocalStorageState('', 'mon_list');

  const everChangedRef = useRef(false);
  const lastKeyUpRef = useRef(Date.now());

  useEffect(() => {
    text && computeMons();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  function onKeyUp() {
    everChangedRef.current = true;
    lastKeyUpRef.current = Date.now();

    setTimeout(() => {
      if ((Date.now() - lastKeyUpRef.current) >= RELOAD_AFTER) {
        computeMons();
      }
    }, RELOAD_AFTER);
  }

  // TODO this should be caching and it's not
  const computeMons = useCallback(() => {
    let newMons: Pokemon[] = [];

    try {
      for (let line of text.split("\n")) {
        const mon = Pokemon.fromLine(line);
        mon && newMons.push(mon);
      }
      setError(undefined);
    } catch(e) {
      setError(e);
    }

    dispatch({ type: 'SET_MONS', mons: newMons });
  }, [text, dispatch, setError]);

  const displayPauseTip = (Date.now() - lastKeyUpRef.current) < RELOAD_AFTER
    && everChangedRef.current;
  

  return (
    <div className="Editor">
      <textarea 
        autoFocus
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyUp={onKeyUp}
        onBlur={computeMons}
        placeholder="Enter your Pokémon here..."
        spellCheck={false}
      />

      {displayPauseTip && (
        <div className="pause-tip">
          <Icon src={['exclamation-circle', 'far']} /> Pause typing to reload graphs.
        </div>
      )}
    </div>
  )
}
