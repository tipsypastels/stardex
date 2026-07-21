import type { Pokemon } from "../../../models/pokemon";
import type { PokemonMutator } from "../../../models/pokemon/mutator";
import { Input } from "../../common/forms/input";

export interface EditPokemonNameProps {
  pokemon: Pokemon;
  mutator: PokemonMutator;
}

export function EditPokemonName(props: EditPokemonNameProps) {
  return (
    <div class="mb-4">
      <h2 class="font-bold">Name</h2>

      <div>
        <Input
          wide
          value={props.pokemon.name}
          onChange={(e) => {
            if (e.currentTarget.value) {
              props.mutator.setCustomName(e.currentTarget.value);
            } else {
              e.currentTarget.value = props.pokemon.name;
            }
          }}
        />
      </div>
    </div>
  );
}
