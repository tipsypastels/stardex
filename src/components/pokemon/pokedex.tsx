import { useModel } from "@preact/signals";
import { PokedexFilter } from "../../models/pokedex_filter";
import { PokedexActions } from "./actions";
import { PokedexFormat } from "./format";

export function Pokedex() {
  const filter = useModel(PokedexFilter);
  return (
    <>
      <PokedexFormat filter={filter} actions={() => <PokedexActions filter={filter} />} />
    </>
  );
}
