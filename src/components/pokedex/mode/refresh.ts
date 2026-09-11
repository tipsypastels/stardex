let callback: (() => void) | undefined;

export function runPokedexModeRefreshCallback() {
  callback?.();
}

export function setPokedexModeRefreshCallback(f: () => void) {
  callback = f;
}

export function clearPokedexModeRefreshCallback() {
  callback = undefined;
}
