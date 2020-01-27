/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useCallback, useEffect, useContext, useRef } from 'react'
import Pokemon from './models/Pokemon';
import { useLocalStorageState } from './helpers/hooks';
import { AppContext } from './App';
import { ErrorContext } from './shared/ErrorBoundary';
import Icon from './shared/Icon';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { mq } from './styling';

const Styles = mq({
  backgroundColor: 'var(--code)',
  boxSizing: 'border-box',
  height: '100vh',
  width: ['85vw', '450px'],
  flexShrink: 0,
  position: 'fixed',
  top: 0,
  left: 0,
  padding: '1rem 0.5rem',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 99999999,

  '&.closed': {
    '@media screen and (max-width: 768px)': {
      width: 0,
      overflow: 'hidden',
      opacity: 0,
      pointerEvents: 'none',
    },
  },

  textarea: {
    flexGrow: 1,
    width: '100%',
    MsOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },

  '.pause-tip': {
    paddingTop: '0.5rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

const RELOAD_AFTER = 1000; // ms

export default function Editor() {
  const [, setError] = useContext(ErrorContext);
  const [{ mobEditorOpen }, dispatch] = useContext(AppContext);
  const [text, setText] = useLocalStorageState('', 'mon_list');
  const ref = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (mobEditorOpen) {
      ref.current?.focus();
      disableBodyScroll(document.body);
    } else {
      enableBodyScroll(document.body);
    }
  }, [mobEditorOpen]);

  const displayPauseTip = (Date.now() - lastKeyUpRef.current) < RELOAD_AFTER
    && everChangedRef.current;
  

  return (
    <div css={Styles} className={`Editor ${mobEditorOpen || 'closed'}`}>
      <textarea 
        autoFocus
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyUp={onKeyUp}
        onBlur={computeMons}
        placeholder="Enter your Pokémon here..."
        spellCheck={false}
        ref={ref}
      />

      {displayPauseTip && (
        <div className="pause-tip">
          <Icon src={['exclamation-circle', 'far']} /> Pause typing to reload graphs.
        </div>
      )}
    </div>
  )
}
