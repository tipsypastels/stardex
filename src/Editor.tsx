import React, { useCallback, useEffect, useContext } from 'react'
import Pokemon, { createMon } from './Pokemon';
import { useLocalStorageState } from './hooks';
import { AppContext } from './App';

const KEYS_TO_RELOAD = ['Enter', 'Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export default function Editor() {
  const [{ mons }, dispatch] = useContext(AppContext);
  const [text, setText] = useLocalStorageState('', 'mon_list');

  useEffect(() => {
    text && computeMons();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  function onKeyUp(e: React.KeyboardEvent) {
    if (KEYS_TO_RELOAD.indexOf(e.key) > -1) {
      computeMons();
    }
  }

  const computeMons = useCallback(() => {
    let newMons: Pokemon[] = [];

    for (let line of text.split("\n")) {
      try {
        const mon = createMon(line);
        mon && newMons.push(mon);
      } catch (e) {
        console.error(e);
      }
    }

    dispatch({ type: 'SET_MONS', mons: newMons });
  }, [text, dispatch]);

  return (
    <div className="Editor">
      <textarea 
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyUp={onKeyUp}
      />

      {mons.length}
    </div>
  )
}
