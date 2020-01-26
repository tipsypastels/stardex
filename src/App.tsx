import React, { Dispatch, createContext, useReducer } from 'react';
import './App.scss';
import Editor from './Editor';
import Pokemon from './models/Pokemon';
import Content from './Content';
import Region, { DEFAULT_CHECKED_REGIONS } from './models/Region';
import Immutable from 'immutable';
import PokemonList from './models/PokemonList';
import ErrorBoundary from './ErrorBoundary';
import REGION_DATA from './data/REGION_DATA';
import { Strictness, STRICTNESSES } from './models/Recommendations';
import { getCacheWithDefault, setCache } from './helpers/cache';

type State = {
  mons: PokemonList;
  regions: Immutable.Set<Region>;
  selectedRegionMons: PokemonList;
  strictness: Strictness;
}

type Action = 
  | { type: 'SET_MONS', mons: Pokemon[] }
  | { type: 'ENABLE_REGION', region: Region }
  | { type: 'DISABLE_REGION', region: Region }
  | { type: 'SET_STRICTNESS', strictness: Strictness }

function reducer(state: State, action: Action): State {
  switch(action.type) {
    case 'SET_MONS': {
      return { ...state, mons: PokemonList.from(action.mons) };
    }
    case 'ENABLE_REGION': {
      const regions = state.regions.add(action.region);
      const selectedRegionMons = createSelectedRegionMons([...regions]);

      setCache('regions', [...regions], JSON.stringify);
      return { ...state, regions, selectedRegionMons };
    }
    case 'DISABLE_REGION': {
      const regions = state.regions.delete(action.region);
      const selectedRegionMons = createSelectedRegionMons([...regions]);

      setCache('regions', [...regions], JSON.stringify);
      return { ...state, regions, selectedRegionMons };
    }
    case 'SET_STRICTNESS': {
      setCache('strictness', action.strictness);
      return { ...state, strictness: action.strictness };
    }
  }
}

function createSelectedRegionMons(regions: Region[]) {
  return PokemonList.combine(regions.map(region => REGION_DATA[region]));
}

type AppContextProps = [State, Dispatch<Action>];
export const AppContext = createContext<AppContextProps>(null as any);

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    mons: new PokemonList(),
    regions: Immutable.Set<Region>(getCacheWithDefault<Region[]>('regions', DEFAULT_CHECKED_REGIONS, JSON.parse, JSON.stringify)),
    selectedRegionMons: createSelectedRegionMons(DEFAULT_CHECKED_REGIONS),
    strictness: getCacheWithDefault('strictness', STRICTNESSES.normal, Number),
  });

  return (
    <AppContext.Provider value={[state, dispatch]}>
      <ErrorBoundary>
        <div className="App">
          <Editor />
          <Content />
        </div>
      </ErrorBoundary>
    </AppContext.Provider>
  );
}