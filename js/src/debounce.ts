const WAIT = 500; // ms

export interface MakeDebouncer<T> {
  onUpdating?(): void;
  onUpdate(value: T): void;
}

export function debouncer<T>(make: MakeDebouncer<T>) {
  let lastValue: T | undefined;
  let lastTimeout: number | undefined;
  let lastUpdating = 0;

  return {
    prepare(value: T) {
      make.onUpdating?.();
      lastValue = value;
    },
    commit() {
      lastUpdating = Date.now();

      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }

      lastTimeout = setTimeout(() => {
        if (Date.now() - lastUpdating >= WAIT) {
          if (lastValue) {
            make.onUpdate(lastValue);
          } else {
            console.error("Debouncer called without being warned of update.");
          }
        }
      }, WAIT);
    },
  };
}
