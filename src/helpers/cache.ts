const noOp = (x: any) => x;

export function getCache<T = string>(key: string, callback: (value: string) => T = noOp): T | undefined {
  const string = localStorage.getItem(key);
  if (!string) {
    return;
  }

  return callback(string);
}

export function setCache<T = string>(key: string, value: T, callback: (value: T) => string = noOp): T {
  localStorage.setItem(key, callback(value));
  return value;
}

export function getCacheWithDefault<T = string>(key: string, def: T, callback: (value: string) => T = noOp, setCallback: (value: T) => string = noOp) {
  return getCache(key, callback) || setCache(key, def, setCallback);
}