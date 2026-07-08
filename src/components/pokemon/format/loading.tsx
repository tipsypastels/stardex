import type { RefObject } from "preact";
import { useSyncExternalStore } from "preact/compat";
import { useEffect } from "preact/hooks";
import { stored } from "../../../utils/storage";
import { Loading } from "../../common/loading";

const DEFAULT_HEIGHT = 144;

const store = stored<number>("stardex_pokedex_format_client_height");

// TODO: Reconsider this approach, it means the size will always be wrong when changing formats.
export function usePokedexFormatClientHeightSaving(ref: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (ref.current?.clientHeight) {
        store.dump(ref.current.clientHeight);
      } else {
        store.clear();
      }
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
}

export function PokedexFormatLoading() {
  const height = useSyncExternalStore(
    () => () => {},
    () => store.load() ?? DEFAULT_HEIGHT,
  );

  return <Loading height={height} />;
}
