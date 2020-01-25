import { useState } from "react"

export function useLocalStorageState(initial: string, key: string): [string, (state: string) => void] {
  const [state, _setState] = useState(localStorage.getItem(key) || initial);

  function setState(state: string) {
    _setState(state);
    localStorage.setItem(key, state);
  }

  return [state, setState];
}