import React, { Dispatch, createContext, useReducer } from 'react';
import './App.scss';
import Editor from './Editor';
import Pokemon, { PokemonList } from './Pokemon';

type State = {
  mons: PokemonList;
}

type Action = 
  | { type: 'SET_MONS', mons: Pokemon[] };

function reducer(state: State, action: Action): State {
  switch(action.type) {
    case 'SET_MONS': {
      return { ...state, mons: PokemonList.from(action.mons) as PokemonList };
    }
  }
}

type AppContextProps = [State, Dispatch<Action>];
// @ts-ignore
export const AppContext = createContext<AppContextProps>(null);

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    mons: new PokemonList(),
  });

  return (
    <AppContext.Provider value={[state, dispatch]}>
      <div className="App">
        <Editor />
      </div>
    </AppContext.Provider>
  );
}