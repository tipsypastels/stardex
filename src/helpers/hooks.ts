import { useState } from "react"
import { getCacheWithDefault, setCache } from "./cache";

export function useLocalStorageState<T = string>(initial: T, key: string, getCallback?: (value: string) => T, setCallback?: (value: T) => string): [T, (state: T) => void] {
  const [state, _setState] = useState(
    getCacheWithDefault(key, initial, getCallback)
  );

  function setState(state: T) {
    _setState(state);
    setCache(key, state, setCallback);
  }

  return [state, setState];
}