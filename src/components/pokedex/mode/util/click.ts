import { batch } from "solid-js";
import type { Pokemon } from "../../../../models/pokemon";
import { pokemons } from "../../../../models/pokemon/list";
import { toasts } from "../../../../models/ui/toast";

export function onClickPokemon(
  pokemon: Pokemon,
  zapper: boolean,
  setEditingId: (id: string) => void,
) {
  if (zapper) {
    batch(() => {
      toasts.add("bolt", `Zapped ${pokemon.name}!`);
      pokemons.delete(pokemon.id);
    });
  } else {
    setEditingId(pokemon.id);
  }
}
