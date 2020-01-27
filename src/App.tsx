/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Dispatch, createContext, useReducer } from 'react';
import Editor from './Editor';
import Pokemon from './models/Pokemon';
import Content from './Content';
import Region, { DEFAULT_CHECKED_REGIONS } from './models/Region';
import Immutable from 'immutable';
import PokemonList from './models/PokemonList';
import ErrorBoundary from './shared/ErrorBoundary';
import { Strictness, STRICTNESSES } from './models/Recommendations';
import { getCacheWithDefault, setCache } from './helpers/cache';
import { globalStyles } from './styling';

type State = {
  mons: PokemonList;
  regions: Immutable.Set<Region>;
  strictness: Strictness;
  mobEditorOpen: boolean; 
}

type Action = 
  | { type: 'SET_MONS', mons: Pokemon[] }
  | { type: 'ENABLE_REGION', region: Region }
  | { type: 'DISABLE_REGION', region: Region }
  | { type: 'SET_STRICTNESS', strictness: Strictness }
  | { type: 'SET_MOB_EDITOR_OPEN', open: boolean }

function reducer(state: State, action: Action): State {
  switch(action.type) {
    case 'SET_MONS': {
      return { ...state, mons: PokemonList.from(action.mons) };
    }
    case 'ENABLE_REGION': {
      const regions = state.regions.add(action.region);
      setCache('regions', [...regions], JSON.stringify);
      return { ...state, regions };
    }
    case 'DISABLE_REGION': {
      const regions = state.regions.delete(action.region);
      setCache('regions', [...regions], JSON.stringify);
      return { ...state, regions };
    }
    case 'SET_STRICTNESS': {
      setCache('strictness', action.strictness);
      return { ...state, strictness: action.strictness };
    }
    case 'SET_MOB_EDITOR_OPEN': {
      return { ...state, mobEditorOpen: action.open };
    }
  }
}

type AppContextProps = [State, Dispatch<Action>];
export const AppContext = createContext<AppContextProps>(null as any);

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    mons: new PokemonList(),
    regions: Immutable.Set<Region>(getCacheWithDefault<Region[]>('regions', DEFAULT_CHECKED_REGIONS, JSON.parse, JSON.stringify)),
    strictness: getCacheWithDefault('strictness', STRICTNESSES.normal, Number),
    mobEditorOpen: false,
  });

  return (
    <AppContext.Provider value={[state, dispatch]}>
      <ErrorBoundary>
        <div css={[globalStyles, { display: 'flex', fontFamily: 'Lato' }]}>
          <Editor />
          <Content />
        </div>
      </ErrorBoundary>
    </AppContext.Provider>
  );
}