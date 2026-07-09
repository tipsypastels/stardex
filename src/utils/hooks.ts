import { useEffect, useRef, type EffectCallback } from "preact/hooks";

export function useDebouncedEffect(f: EffectCallback, delay?: number, inputs?: unknown[]) {
  const timeout = useRef<number>();

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      f();
      timeout.current = undefined;
    }, delay);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, inputs);
}
