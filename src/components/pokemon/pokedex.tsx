import { PokedexActions } from "./actions";
import { PokedexFormat } from "./format";

export function Pokedex() {
  return (
    <>
      <PokedexFormat actions={() => <PokedexActions />} />
    </>
  );
}
