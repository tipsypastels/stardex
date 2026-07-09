import { useModel } from "@preact/signals";
import { PokedexFilter } from "../../models/pokedex_filter";
import { Section } from "../layout/section";
import { PokedexActions } from "./actions";
import { PokedexFormat } from "./format";

export function Pokedex() {
  const filter = useModel(PokedexFilter);
  return (
    <Section id="pokedex" title="Pokedex" hasActions>
      <PokedexFormat filter={filter} actions={() => <PokedexActions filter={filter} />} />
    </Section>
  );
}
